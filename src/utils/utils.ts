
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { _TypedDataEncoder } from "@ethersproject/hash";
import { ChainId } from '@aave/contract-helpers';
import { getNetworkConfig } from './networksConfig';
import { getProvider } from './networksConfig';
import { Contract, VoidSigner } from 'ethers';
import forwarderABI from '../../abi/MinimalForwarder.json';
import erc721ABI from '../../abi/ERC721.json';

import utils from 'web3-utils';
const abi = require('web3-eth-abi');



export function hexToAscii(_hex: string): string {
  const hex = _hex.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export interface CancelablePromise<T = unknown> {
  promise: Promise<T>;
  cancel: () => void;
}

export const makeCancelable = <T>(promise: Promise<T>) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const optimizedPath = (currentChainId: ChainId) => {
  return (
    currentChainId === ChainId.arbitrum_one ||
    currentChainId === ChainId.arbitrum_rinkeby ||
    currentChainId === ChainId.optimism
    // ||
    // currentChainId === ChainId.optimism_kovan
  );
};

export const getTokenOwnerOf = async (tokenId: number, chainId: number) => {
  const config = getNetworkConfig(chainId);
  const provider = getProvider(chainId);
  const contract = new Contract(config.vaultAddress, erc721ABI, provider);
  const address = await contract.ownerOf(tokenId);

  return address;
}

export const getTokenURI = async (tokenId: number | string, chainId: number) => {
  const config = getNetworkConfig(chainId);
  const provider = getProvider(chainId);
  const contract = new Contract(config.vaultAddress, erc721ABI, provider);
  const address = await contract.tokenURI(Number(tokenId));

  return address;
}

export const getTokenIdsOwnedBy = async (address: string) => {
  const URL = `${process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || 'https://9zo3rpz4iymh.usemoralis.com:2053/server'}/functions/getTokensByOwerAddress/?ApplicationId=${process.env.NEXT_PUBLIC_MORALIS_APP_ID || 'Ftx6YJO9aP4EmAq8wN7pAxHeQKKLvVv909gQq0OK'}&address=${address}`;

  const response = await fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.log('getTokenIdsOwnedBy error: ', response.statusText);
    return [];
  }

  const json = await response.json();

  return json.result;
}

export const getEIP712ForwarderSignature = async (nftId: number, from: string, chainId: number, hash: string) => {
  const config = getNetworkConfig(chainId);
  const provider = getProvider(chainId);
  const signer = new VoidSigner(from, provider);

  const domain: TypedDataDomain = {
    name: 'MinimalForwarder',
    version: '0.0.1',
    chainId,
    verifyingContract: config.forwarderAddress,
  };

  const requestTypes: Record<string, Array<TypedDataField>> = {
    ForwardRequest: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'gas', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
  };

  // encode function call
  const calldata = abi.encodeFunctionCall(
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId_',
          type: 'uint256',
        },
        {
          internalType: 'bytes32',
          name: 'hash_',
          type: 'bytes32',
        },
      ],
      name: 'lock',
      type: 'function',
    },
    [nftId, hash]
  );

  // estimate gas
  const estimatedGas = await signer.estimateGas({
    to: config.retrievalManagerAddress,
    data: calldata,
  });

  // get nonce
  const forwarder = new Contract(config.forwarderAddress, forwarderABI, provider);
  const nonce = await forwarder.getNonce(from);

  const message = {
    from,
    to: config.retrievalManagerAddress,
    value: 0,
    gas: estimatedGas.toNumber(),
    nonce: nonce.toNumber(),
    data: calldata,
  };

  // Populate any ENS names (in-place)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const populated = await _TypedDataEncoder.resolveNames(domain, requestTypes, message, (name: string) => {
    return provider.resolveName(name);
  });
  const rpcData = _TypedDataEncoder.getPayload(populated.domain, requestTypes, populated.value);

  console.log({rpcData});

  return rpcData;
};

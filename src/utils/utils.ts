import { ChainId } from '@aave/contract-helpers';
import { getNetworkConfig } from './networksConfig';
import { getProvider } from './networksConfig';
import { Contract } from 'ethers';

import utils from 'web3-utils';
const abi = require('web3-eth-abi');

import forwarderABI from '../../abi/MinimalForwarder.json';

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

export const getEIP712ForwarderSignature = async (nftId: number, from: string, chainId: number, hash: string) => {
  const config = getNetworkConfig(chainId);
  const provider = getProvider(chainId);

  console.log({nftId, from, chainId, hash});

  // types
  const domainTypes = [
    // { name: 'type', type: 'bytes32' },
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ];

  const forwardRequestTypes = [
    // { name: 'type', type: 'bytes32' },
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
  ];

  // data
  // const typeHashDomain = utils.keccak256(
  //   'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
  // );

  // const typeHashStruct = utils.keccak256(
  //   'ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)'
  // );

  const domainData = {
    // type: typeHashDomain,
    name: 'MinimalForwarder',
    version: '0.0.1',
    chainId,
    verifyingContract: config.forwarderAddress,
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
  const estimatedGas = await provider.estimateGas({
    to: config.retrievalManagerAddress,
    data: calldata,
  });

  // get nonce
  const forwarder = new Contract(config.forwarderAddress, forwarderABI, provider);
  const nonce = await forwarder.getNonce(from);

  var message = {
    // type: typeHashStruct,
    from,
    to: config.retrievalManagerAddress,
    value: 0,
    gas: estimatedGas.toNumber(),
    nonce: nonce.toNumber(),
    data: calldata,
  };

  const data = JSON.stringify({
    domain: domainData,
    primaryType: 'Struct',
    types: {
      EIP712Domain: domainTypes,
      Struct: forwardRequestTypes,
    },
    message: message,
  });

  return data;
};

import { ChainId } from '@aave/contract-helpers';

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

export const getEIP712Data = (
  nftId: number,
  deadline: number,
  chainId: number,
  contractAddress: string
) => {
  // types
  const domainTypes = [
    { name: 'type', type: 'bytes32' },
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ];

  const structHashTypes = [
    { name: 'Token Id', type: 'uint256' },
    { name: 'Expiration', type: 'uint64' },
  ];

  // data
  const typeHash = utils.keccak256(
    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
  );

  const domainData = {
    type: typeHash,
    name: 'BeckettVault',
    version: 'v1',
    chainId,
    verifyingContract: contractAddress,
  };

  var message = {
    'Token Id': nftId,
    Expiration: deadline,
  };

  const data = JSON.stringify({
    types: {
      EIP712Domain: domainTypes,
      Struct: structHashTypes,
    },
    domain: domainData,
    primaryType: 'Struct',
    message: message,
  });

  return data;
};

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
  const structHash = utils.keccak256(
    abi.encodeParameters(['uint256', 'uint64'], [nftId, deadline])
  );
  const typeHash = utils.keccak256(
    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
  );
  const nameHash = utils.keccak256('BeckettVault');
  const versionHash = utils.keccak256('v1');

  const domainSeparator = utils.keccak256(
    abi.encodeParameters(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [typeHash, nameHash, versionHash, chainId, contractAddress]
    )
  );
  const hash = utils.soliditySha3('\x19\x01', domainSeparator, structHash);

  return hash;
};

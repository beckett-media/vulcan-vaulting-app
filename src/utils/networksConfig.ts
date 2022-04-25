import { ChainId, ChainIdToNetwork } from '@aave/contract-helpers';
import { providers as ethersProviders } from 'ethers';

import {
  BaseNetworkConfig,
  ExplorerLinkBuilderConfig,
  ExplorerLinkBuilderProps,
  NetworkConfig,
  networkConfigs as _networkConfigs,
} from '../ui-config/networksConfig';

export type Pool = {
  address: string;
};

export const NEXT_PUBLIC_ENABLE_TESTNET =
  (!global?.window?.localStorage.getItem('testnetsEnabled') &&
    process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true') ||
  global?.window?.localStorage.getItem('testnetsEnabled') === 'true';

// determines if forks should be shown
const FORK_ENABLED = global?.window?.localStorage.getItem('forkEnabled') === 'true';
// specifies which network was forked
const FORK_BASE_CHAIN_ID = Number(global?.window?.localStorage.getItem('forkBaseChainId') || 1);
// specifies on which chainId the fork is running
const FORK_CHAIN_ID = Number(global?.window?.localStorage.getItem('forkChainId') || 3030);
const FORK_RPC_URL = global?.window?.localStorage.getItem('forkRPCUrl') || 'http://127.0.0.1:8545';
const FORK_WS_RPC_URL =
  global?.window?.localStorage.getItem('forkWsRPCUrl') || 'ws://127.0.0.1:8545';

/**
 * Generates network configs based on networkConfigs & fork settings.
 * Forks will have a rpcOnly clone of their underlying base network config.
 */
export const networkConfigs = Object.keys(_networkConfigs).reduce((acc, value) => {
  acc[value] = _networkConfigs[value];
  if (FORK_ENABLED && Number(value) === FORK_BASE_CHAIN_ID) {
    acc[FORK_CHAIN_ID] = {
      ..._networkConfigs[value],
      // rpcOnly: true,
      isFork: true,
      privateJsonRPCUrl: FORK_RPC_URL,
      privateJsonRPCWSUrl: FORK_WS_RPC_URL,
      underlyingChainId: FORK_BASE_CHAIN_ID,
    };
  }
  return acc;
}, {} as { [key: string]: BaseNetworkConfig });

const linkBuilder =
  ({ baseUrl, addressPrefix = 'address', txPrefix = 'tx' }: ExplorerLinkBuilderConfig) =>
  ({ tx, address }: ExplorerLinkBuilderProps): string => {
    if (tx) {
      return `${baseUrl}/${txPrefix}/${tx}`;
    }
    if (address) {
      return `${baseUrl}/${addressPrefix}/${address}`;
    }
    return baseUrl;
  };

export function getNetworkConfig(chainId: ChainId): NetworkConfig {
  const config = networkConfigs[chainId];
  if (!config) {
    // this case can only ever occure when a wallet is connected with a unknown chainId which will not allow interaction
    const name = ChainIdToNetwork[chainId];
    return {
      name: name || `unknown chainId: ${chainId}`,
    } as unknown as NetworkConfig;
  }
  return {
    ...config,
    explorerLinkBuilder: linkBuilder({ baseUrl: config.explorerLink }),
  };
}

export function getDefaultChainId() {
  return 137;
}

export function getSupportedChainIds(): number[] {
  return [80001, 137];
}

const providers: { [network: string]: ethersProviders.Provider } = {};

export const getProvider = (chainId: ChainId): ethersProviders.Provider => {
  if (!providers[chainId]) {
    const config = getNetworkConfig(chainId);
    const chainProviders: ethersProviders.StaticJsonRpcProvider[] = [];
    if (config.privateJsonRPCUrl) {
      providers[chainId] = new ethersProviders.StaticJsonRpcProvider(
        config.privateJsonRPCUrl,
        chainId
      );
      return providers[chainId];
    }
    if (config.publicJsonRPCUrl.length) {
      config.publicJsonRPCUrl.map((rpc) =>
        chainProviders.push(new ethersProviders.StaticJsonRpcProvider(rpc, chainId))
      );
    }
    if (!chainProviders.length) {
      throw new Error(`${chainId} has no jsonRPCUrl configured`);
    }
    if (chainProviders.length === 1) {
      providers[chainId] = chainProviders[0];
    } else {
      providers[chainId] = new ethersProviders.FallbackProvider(chainProviders);
    }
  }
  return providers[chainId];
};

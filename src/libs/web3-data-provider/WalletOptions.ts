import { ChainId } from '@aave/contract-helpers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { getNetworkConfig, getSupportedChainIds } from '../../utils/networksConfig';

export enum WalletType {
  INJECTED = 'injected',
  WALLET_CONNECT = 'wallet_connect',
}

export const getWallet = (
  wallet: WalletType,
  chainId: ChainId = ChainId.mainnet
): AbstractConnector => {
  const supportedChainIds = getSupportedChainIds();

  console.log(wallet);

  switch (wallet) {
    case WalletType.INJECTED:
      return new InjectedConnector({});
    case WalletType.WALLET_CONNECT:
      return new WalletConnectConnector({
        rpc: supportedChainIds.reduce((acc, network) => {
          const config = getNetworkConfig(network);
          acc[network] = config.privateJsonRPCUrl || config.publicJsonRPCUrl[0];
          return acc;
        }, {} as { [networkId: number]: string }),
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
      });
    default: {
      throw new Error(`unsupported wallet`);
    }
  }
};

import { Alert, Box, Button, Link, Typography } from '@mui/material';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { WalletType } from '../../libs/web3-data-provider/WalletOptions';
import { TxModalTitle } from './TxModalTitle';
import { UnsupportedChainIdError } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/walletconnect-connector';
import { NoEthereumProviderError } from '@web3-react/injected-connector';

export type WalletRowProps = {
  walletName: string;
  walletType: WalletType;
};

const WalletRow = ({ walletName, walletType }: WalletRowProps) => {
  const { connectWallet } = useWeb3Context();

  const getWalletIcon = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.INJECTED:
        return (
          <img
            src={`/icons/wallets/browserWallet.svg`}
            width="24px"
            height="24px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.WALLET_CONNECT:
        return (
          <img
            src={`/icons/wallets/walletConnect.svg`}
            width="24px"
            height="24px"
            alt={`browser wallet icon`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Button
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        mb: '8px',
      }}
      size="large"
      onClick={() => connectWallet(walletType)}
      endIcon={getWalletIcon(walletType)}
    >
      {walletName}
    </Button>
  );
};

export enum ErrorType {
  UNSUPORTED_CHAIN,
  USER_REJECTED_REQUEST,
  UNDETERMINED_ERROR,
  NO_WALLET_DETECTED,
}

export const WalletSelector = () => {
  const { error } = useWeb3Context();

  let blockingError: ErrorType | undefined = undefined;
  if (error) {
    if (error instanceof UnsupportedChainIdError) {
      blockingError = ErrorType.UNSUPORTED_CHAIN;
    } else if (error instanceof UserRejectedRequestError) {
      blockingError = ErrorType.USER_REJECTED_REQUEST;
    } else if (error instanceof NoEthereumProviderError) {
      blockingError = ErrorType.NO_WALLET_DETECTED;
    } else {
      blockingError = ErrorType.UNDETERMINED_ERROR;
    }
    // TODO: add other errors
  }

  const handleBlocking = () => {
    switch (blockingError) {
      case ErrorType.UNSUPORTED_CHAIN:
        return <div>Network not supported for this wallet</div>;
      case ErrorType.USER_REJECTED_REQUEST:
        return <div>Rejected connection request</div>;
      case ErrorType.NO_WALLET_DETECTED:
        return <div>Wallet not detected. Connect or install wallet and retry</div>;
      default:
        console.log('Uncatched error: ', error);
        return <div>Error connecting. Try refreshing the page.</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TxModalTitle title="Connect a wallet" />
      {error && (
        <Alert severity="error" sx={{ mb: '24px' }}>
          {handleBlocking()}
        </Alert>
      )}
      <WalletRow
        key="browser_wallet"
        walletName="Browser wallet"
        walletType={WalletType.INJECTED}
      />
      <WalletRow
        key="walletconnect_wallet"
        walletName="WalletConnect"
        walletType={WalletType.WALLET_CONNECT}
      />

      <Typography sx={{ mt: '30px', alignSelf: 'center' }}>
        <div>
          Wallets are provided by External Providers and by selecting you agree to Terms of those
          Providers. Your access to the wallet might be reliant on the External Provider being
          operational.
        </div>
      </Typography>
    </Box>
  );
};

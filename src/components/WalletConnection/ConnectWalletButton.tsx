import { useWalletModalContext } from '../../hooks/useWalletModal';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { WalletModal } from './WalletModal';
import { getEIP712Data } from '../../utils/utils';
import { getNetworkConfig } from '../../utils/networksConfig';

export const ConnectWalletButton = () => {
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, chainId, signTxData } = useWeb3Context();

  const handleConnect = async () => {
    if (connected) {
      // 1 hour deadline
      const deadline = Math.floor(Date.now() / 1000 + 3600);
      const tokenId = 1;
      const config = getNetworkConfig(chainId);
      const data = getEIP712Data(tokenId, deadline, chainId, config.vaultAddress);

      const signature = await signTxData(data);
      console.log(signature);
    } else {
      setWalletModalOpen(true);
    }
  };

  return (
    <div className="btn__outline--outer gradient__green">
      <button
        className="btn btn__outline--inner deposit__btn u__flex flex__jcsa flex__aic"
        id="walletButton"
        onClick={handleConnect}
      >
        {currentAccount.length > 0 ? (
          <>
            <span>
              {String(currentAccount).substring(0, 6) +
                '...' +
                String(currentAccount).substring(38)}
            </span>
            <div className={`status-dot ${currentAccount ? 'bg__green' : 'bg__grey'}`}></div>
          </>
        ) : (
          <>
            <div>Connect Wallet</div>{' '}
            <div className={`status-dot ${currentAccount ? 'bg__green' : 'bg__grey'}`}></div>
          </>
        )}
      </button>
      <WalletModal />
    </div>
  );
};

import { useWalletModalContext } from '../../hooks/useWalletModal';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { WalletModal } from './WalletModal';

export const ConnectWalletButton = () => {
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, chainId, signTxData, isExpectedChain } = useWeb3Context();

  const handleConnect = async () => {
    if (connected) {
      
    } else {
      setWalletModalOpen(true);
    }
  };

  console.log(isExpectedChain);
  

  return (
    <div className={`btn__outline--outer gradient__green ${(currentAccount && !isExpectedChain) && 'gradient__orange'}`}>
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
            <div className={`status-dot ${(currentAccount && !isExpectedChain) ? 'bg__orange' : 'bg__green'}`}></div>
          </>
        ) : (
          <>
            <div>Connect Wallet</div>{' '}
            <div className={`status-dot bg__grey`}></div>
          </>
        )}
      </button>
      <WalletModal />
    </div>
  );
};

import { useWalletModalContext } from '../../hooks/useWalletModal';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { WalletModal } from './WalletModal';

export const ConnectWalletButton = () => {
  const { setWalletModalOpen } = useWalletModalContext();
  const { currentAccount } = useWeb3Context();

  return (
    <div className="btn__outline--outer gradient__green">
      <button
        className="btn btn__outline--inner deposit__btn u__flex flex__jcsa flex__aic"
        id="walletButton"
        onClick={() => setWalletModalOpen(true)}
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

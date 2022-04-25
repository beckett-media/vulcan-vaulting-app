import { useWalletModalContext } from '../../hooks/useWalletModal';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { WalletModal } from './WalletModal';
import { getEIP712ForwarderSignature } from '../../utils/utils';

export const ConnectWalletButton = () => {
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, chainId, signTxData } = useWeb3Context();

  const handleConnect = async () => {
    if (connected) {
      // 1 hour deadline
      const tokenId = 1;
      const data = await getEIP712ForwarderSignature(tokenId, currentAccount, chainId);
      console.log('end', data);

      const signature = await signTxData(data);
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

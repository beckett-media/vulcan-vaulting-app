import styles from './deposit.module.scss';

import { useRef } from 'react';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { ConnectWalletButton } from '../src/components/WalletConnection/ConnectWalletButton';
import { getExpectedChainId } from '../src/utils/networksConfig';

import Logo from '../public/logo.svg';

import NFTGallery from '../src/components/Forms/NFTGallery';
import Tooltip from '../src/components/Tooltip/Tooltip';
import gsap from 'gsap';

export default function HomePage() {
  const { currentAccount, loading: web3Loading, disconnectWallet, isExpectedChain, switchNetwork} = useWeb3Context();

  const el = useRef();
  const q = gsap.utils.selector(el);

  const fadeIn = (selector) => {
    const t1 = gsap.timeline();
    t1.to(q(`${selector}`), { display: 'flex', opacity: 1 }).to(q(`${selector}`), {
      opacity: 0,
      display: 'none',
      delay: 4,
    });

    return () => {
      t1.kill();
    };
  };

  const handleSwitchClick = async () => {
    console.log('success');
    
    if (isExpectedChain) {
      return;
    }

    await switchNetwork(getExpectedChainId());
  }

  return (
    <div className={`${styles.deposit} u__center`} ref={el}>
      <div className={`${styles.deposit__hero} u__center`}>
        <img src={Logo.src} className={`heading ${styles.deposit__logo}`} />

        <h2 className={`heading heading__secondary ${styles.deposit__heading}`}>Home</h2>

        <img className={`${styles['deposit__hero-image']}`} alt=""></img>
        <div className={`${styles['deposit__hero-content']} u__center`}>
          <p>Connect your wallet and browse NFTs you have.</p>
        </div>
        <div className={`${styles['deposit__wallet-buttons']} u__relative flex__aic`}>
          {!currentAccount && <Tooltip
            className={`${styles['deposit__tooltip--left']}`}
            direction={'right'}
          >Please connect your wallet first.</Tooltip>}
          <div className={`btn__outline--outer bg__grey`}>
            {currentAccount ? (
              <button
                className={`btn__outline--inner btn ${styles.deposit__btn}`}
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </button>
            ) : (
              <button
                className={`btn__outline--inner btn btn__disabled ${styles.deposit__btn}`}
                onClick={() => fadeIn(`.${styles['deposit__tooltip--left']}`)}
              >
                Disconnect Wallet
              </button>
            )}
          </div>

          <ConnectWalletButton />
        </div>
      </div>
      <div className={`${styles['deposit__form']} u__flex flex__jcc`}>
        <NFTGallery />
      </div>
    </div>
  );
}

import styles from './deposit.module.scss';

import { useRef } from 'react';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { ConnectWalletButton } from '../src/components/WalletConnection/ConnectWalletButton';
import { getExpectedChainId } from '../src/utils/networksConfig';

import Logo from '../public/logo.svg';

import WithdrawForm from '../src/components/Forms/WithdrawForm';
import Tooltip from '../src/components/Tooltip/Tooltip';
import gsap from 'gsap';

export default function DepositPage() {
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

        <h2 className={`heading heading__secondary ${styles.deposit__heading}`}>Item Withdraw</h2>

        <img className={`${styles['deposit__hero-image']}`} alt=""></img>
        <div className={`${styles['deposit__hero-content']} u__center`}>
          <p>Tell us about yourself and the collectible you would like to withdraw. If you originally vaulted this collectible, check the box below and tell us your wallet address and NFT ID to continue.</p>
          {/* {(currentAccount && !isExpectedChain) && <div className={`${styles.notice} u__absolute`}>You are connected to a network that isn't Polygon Mainnet. <br></br><span style={{outline: '1px solid grey'}} className='btn btn__outline--inner' onClick={() => handleSwitchClick()}>Click here to switch to Polygon Mainnet</span></div>} */}
        </div>
        <div className={`${styles['deposit__wallet-buttons']} u__relative flex__aic`}>
          {!currentAccount && <Tooltip
            className={`${styles['deposit__tooltip--left']}`}
            message={'Please connect your wallet first.'}
            direction={'right'}
          />}
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
        <WithdrawForm additionalData={{ currentAccount }} />
      </div>
    </div>
  );
}

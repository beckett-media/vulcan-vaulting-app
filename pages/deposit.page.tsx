import styles from './deposit.module.scss';

import { useRef } from 'react';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { ConnectWalletButton } from '../src/components/WalletConnection/ConnectWalletButton';

import Logo from '../public/logo.svg';

import DepositForm from '../src/components/Forms/DepositForm';
import Tooltip from '../src/components/Tooltip/Tooltip';
import gsap from 'gsap';
import { getExpectedChainId } from '../src/utils/networksConfig';

export default function DepositPage() {
  const { currentAccount, loading: web3Loading, disconnectWallet, isExpectedChain, switchNetwork } = useWeb3Context();

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
    if (isExpectedChain) {
      return;
    }

    await switchNetwork(getExpectedChainId());
  }

  return (
    <div className={`${styles.deposit} u__center`} ref={el}>
      <div className={`${styles.deposit__hero} u__center`}>
        <img src={Logo.src} className={`heading ${styles.deposit__logo}`} alt="Deposit" />

        <h2 className={`heading heading__secondary ${styles.deposit__heading}`}>Item Deposit</h2>

        <img className={`${styles['deposit__hero-image']}`} alt=""></img>
        <div className={`${styles['deposit__hero-content']} u__center`}>
          <p>Tell us about yourself and the collectible you would like to vault.</p>
          <p>
            A personal concierge will reach out to walk you through the vaulting and NFT-minting of
            your collectible.
          </p>
        </div>
        <div className={`${styles['deposit__wallet-buttons']} u__relative flex__aic`}>
          <Tooltip
            className={`${styles['deposit__tooltip--left']}`}
            message={'Please fill out the form below and your concierge will help you create one.'}
            direction={'right'}
          />
          <div className={`btn__outline--outer gradient__orange`}>
            {currentAccount ? (
              <button
                className={`btn__outline--inner btn ${styles.deposit__btn}`}
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </button>
            ) : (
              <button
                className={`btn__outline--inner btn ${styles.deposit__btn}`}
                onClick={() => fadeIn(`.${styles['deposit__tooltip--left']}`)}
              >
                I don't have a wallet
              </button>
            )}
          </div>

          <ConnectWalletButton />
        </div>
      </div>
      <div className={`${styles['deposit__form']} u__flex flex__jcc`}>
        <DepositForm additionalData={{ currentAccount }} />
      </div>
    </div>
  );
}

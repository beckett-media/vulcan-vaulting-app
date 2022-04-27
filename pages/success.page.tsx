import styles from './deposit.module.scss';

import { useRef } from 'react';
import Logo from '../public/logo.svg';

export default function SuccessPage() {
  const el = useRef();



  return (
    <div className={`${styles.deposit} u__center`} ref={el}>
      <div className={`${styles.deposit__hero} u__center`}>
        <img src={Logo.src} className={`heading ${styles.deposit__logo}`} />
        {/* <h2 className={`heading heading__secondary ${styles.deposit__heading}`}>Item Deposit</h2> */}
        <img className={`${styles['deposit__hero-image']}`} alt=""></img>
        <div className={`${styles['deposit__hero-content']} u__center`}>
          <p>Thank you for submitting this form</p>
        </div>

      </div>
    </div>
  );
}

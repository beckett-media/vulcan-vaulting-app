import React from 'react';
import styles from './tooltip.module.scss';

const Tooltip = (props) => {
  return (
    <div className={`${styles.tooltip} u__absolute flex__aic u__flex ${props.className}`}>
      {props.direction === 'left' && (
        <div className={`${styles['tooltip-arrow']} ${styles['tooltip-arrow--left']}`}></div>
      )}
      <div className={`${styles['tooltip-body']}`}>{props.message}</div>
      {props.direction === 'right' && (
        <div className={`${styles['tooltip-arrow']} ${styles['tooltip-arrow--right']}`}></div>
      )}
    </div>
  );
};

export default Tooltip;

import React from 'react';

import styles from './styles.css';

export default function Backdrop({ isVisible, onClick }) {
  return isVisible ? <div className={styles.Backdrop} onClick={onClick}></div> : null;
}

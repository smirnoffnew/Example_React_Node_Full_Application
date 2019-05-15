import React from 'react';
import styles from './styles.css';

export default function Loader() {
  return (
    <div className={styles.Loader__container}>
      <div className={styles.Loader} />
    </div>
  );
}

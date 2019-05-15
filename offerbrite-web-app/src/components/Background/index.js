import React from 'react';
import styles from './styles.css';

export default function Background({ children }) {
  return (
    <div className={styles.Background}>
      {children}
    </div>
  );
}

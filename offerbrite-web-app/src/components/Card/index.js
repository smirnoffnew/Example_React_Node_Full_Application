import React from 'react';
import styles from './styles.css';

export default function Card({ children }) {
  return (
    <div className={styles.Card}>
      {children}
    </div>
  );
}

import React from 'react';
import styles from './styles.css';

export default function Button(props) {
  return (
    <button
      className={[styles.Button, styles[props.theme]].join(' ')}
      {...props}
    >
      {props.children}
    </button>
  );
}

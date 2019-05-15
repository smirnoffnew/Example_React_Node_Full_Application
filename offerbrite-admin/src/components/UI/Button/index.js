import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Button = ({ children, onClick, block, disabled, orange }) => (
  <button
    className={[
      styles.Button,
      orange ? styles.Button_orange : styles.Button_blue,
      block ? styles.Button_block : null,
      disabled ? styles.Button_disabled : null,
    ].join(' ')}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;

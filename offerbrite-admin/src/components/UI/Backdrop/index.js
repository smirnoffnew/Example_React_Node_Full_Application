import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Backdrop = ({ isVisible, onClick }) => isVisible ?
  <div className={styles.Backdrop} onClick={onClick} /> : null;

Backdrop.propTypes = {
  isVisible: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Backdrop;

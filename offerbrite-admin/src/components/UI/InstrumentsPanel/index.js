import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const InstrumentsPanel = ({ children }) => (
  <div className={styles.InstrumentsPanel}>
    {children}
  </div>
);

InstrumentsPanel.propTypes = {
  children: PropTypes.any,
};

export default InstrumentsPanel;

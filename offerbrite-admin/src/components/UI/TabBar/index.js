import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const TabBar = ({ children }) => (
  <div className={styles.TabBar}>
    {children}
  </div>
);

TabBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabBar;

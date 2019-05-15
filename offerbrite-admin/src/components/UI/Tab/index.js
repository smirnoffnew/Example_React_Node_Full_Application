import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Tab = ({ active, title, onClick }) => (
  <div
    onClick={onClick}
    className={[
      styles.Tab,
      active ? styles.Tab_active : styles.Tab_default,
    ].join(' ')}>
    {title}
  </div>
);

Tab.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tab;

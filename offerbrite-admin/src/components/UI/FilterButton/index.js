import React from 'react';
import PropTypes from 'prop-types';

import { MdFilterList } from 'react-icons/md';
import styles from './styles.module.scss';

const FilterButton = ({ active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      styles.Button,
      active ? styles.Button_active : null,
    ].join(' ')}
  >
    Reset
  </button>
);

FilterButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default FilterButton;

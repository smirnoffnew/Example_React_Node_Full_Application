import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const CountBadge = ({ count, className }) => (
  <div className={[styles.CountBadge, className].join(' ')}>
    {count}
  </div>
);

CountBadge.propTypes = {
  count: PropTypes.number,
};

export default CountBadge;
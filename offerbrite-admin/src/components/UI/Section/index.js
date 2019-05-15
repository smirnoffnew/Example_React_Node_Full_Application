import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Section = ({ header, children }) => (
  <div className={styles.Section}>
    {header && <h3 className={styles.Section__header}>{header}</h3>}
    {children}
  </div>
);

Section.propTypes = {
  header: PropTypes.string,
  children: PropTypes.any,
};

export default Section;

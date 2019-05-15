import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Content = ({ children }) => (
  <div className={styles.Content}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.any,
};

export default Content;

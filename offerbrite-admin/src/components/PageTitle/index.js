import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const PageTitle = ({ title }) => <h2 className={styles.PageTitle}>{title}</h2>;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;

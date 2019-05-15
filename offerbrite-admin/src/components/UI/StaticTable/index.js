import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const StaticTable = ({ columns }) => (
  <div className={styles.Table}>
    {
      columns.map((column, index) => (
        <div key={index} className={styles.Table__column}>
          <div className={styles.Table__column__header}>
            {column.header}
          </div>
          {
            column.data.map((item, index) => (
              <div key={index} className={styles.Table__column__cell}>
                {item}
              </div>
            ))
          }
        </div>
      ))
    }
  </div>
);

StaticTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.node.isRequired),
    })
  ),
};

export default StaticTable;

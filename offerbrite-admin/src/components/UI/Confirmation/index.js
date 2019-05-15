import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Confirmation = ({ actionTitle, onCancel, onConfirm }) => (
  <div className={styles.Confirmation}>
    <button
      className={[styles.Confirmation__button, styles.Confirmation__button_left].join(' ')}
      onClick={onCancel}
    >
      Cancel
      </button>
    <button
      className={[styles.Confirmation__button, styles.Confirmation__button_right].join(' ')}
      onClick={onConfirm}
    >
      {actionTitle}
    </button>
  </div>
);

Confirmation.propTypes = {
  actionTitle: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Confirmation;

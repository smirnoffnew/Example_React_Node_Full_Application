import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import Backdrop from 'components/UI/Backdrop';
import styles from './styles.module.scss';

const Modal = ({ isVisible, onClose, children, header }) => (
  <Fragment>
    <Backdrop isVisible={isVisible} onClick={onClose} />
    {
      isVisible &&
      <div className={styles.Modal}>
        <header className={styles.Modal__header}>
          <div className={styles.Modal__header__text}>{header}</div>
          <div className={styles.Modal__header__closeBtn} onClick={onClose}>
            <MdClose className={styles.Modal__header__closeBtn__button} />
          </div>
        </header>
        {children}
      </div>
    }
  </Fragment>
);

Modal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;

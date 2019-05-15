import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';
import styles from './styles.css';
import Backdrop from '../Backdrop';
import Button from '../Button';

class Modal extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.isVisible !== this.props.isVisible;
  }

  render() {
    const { isVisible, onClose, message, buttonTheme } = this.props;

    return (
      <Fragment>
        <Backdrop isVisible={isVisible} onClick={onClose} />
        <div
          className={styles.Modal}
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: isVisible ? '1' : '0'
          }}
        >
          <p className={styles.Modal__message}>{message}</p>
          <div className={styles.Modal__button}>
            <Button theme={buttonTheme} onClick={onClose}>
              <Link to="/" className={styles.Modal__link}>OK</Link>
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Modal;
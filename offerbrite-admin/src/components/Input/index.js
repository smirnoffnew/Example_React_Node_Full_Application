import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class Input extends Component {
  state = {
    isFocused: false,
  };

  onToggleFocus = () => {
    this.setState(prevState => ({ isFocused: !prevState.isFocused }));
  };

  render() {
    const { isFocused } = this.state;
    const { label, inputtype } = this.props;

    return (
      <div className={[
        styles.Input,
        isFocused ? styles.Input_focused : styles.Input_blured,
      ].join(' ')}>
        {label && <div className={styles.Input__label}>{label}</div>}
        {
          inputtype === 'textarea' ?
            <textarea
              className={styles.Input__element}
              onFocus={this.onToggleFocus}
              onBlur={this.onToggleFocus}
              {...this.props}
              rows={5}
              maxLength={150}
            /> :
            <input
              className={styles.Input__element}
              onFocus={this.onToggleFocus}
              onBlur={this.onToggleFocus}
              {...this.props}
            />
        }
      </div>
    );
  }
}

Input.propTypes = {};

export default Input;

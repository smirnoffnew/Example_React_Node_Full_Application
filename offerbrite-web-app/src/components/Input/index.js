import React, { Component, Fragment } from 'react';
import styles from './styles.css';
import eyeIcon from '../../assets/icons/eye.svg';
import eyeOffIcon from '../../assets/icons/eye-off.svg';

class Input extends Component {

  state = {
    isPasswordVisible: false,
    focused: false,
  }

  onIconClickHandler = () => {
    this.setState(prevState => ({ isPasswordVisible: !prevState.isPasswordVisible }));
  }

  render() {
    const { isPasswordVisible, focused } = this.state;
    const { input, meta, error, theme } = this.props;

    return (
      <div className={styles.Input}>
        <label
          htmlFor={this.props.id}
          className={styles.Input__label}
        >
          {this.props.label}
        </label>
        <div className={[
          styles.Input__box,
          focused ? styles[`Input__box_onFocus_${theme}`] : styles.Input__box_onBlur,
        ].join(' ')}>
          <input
            id={this.props.id}
            className={styles.Input__box__element}
            type={isPasswordVisible ? 'text' : 'password'}
            onFocus={() => this.setState({ focused: true })}
            onBlur={() => this.setState({ focused: false })}
            value={input.value}
            onChange={input.onChange}
            {...this.props}
          />
          <div
            onClick={this.onIconClickHandler}
            className={styles.Input__box__icon__container}>
            <img
              alt="eye icon"
              src={this.state.isPasswordVisible ? eyeIcon : eyeOffIcon}
              className={styles.Input__box__icon__image}
            />
          </div>
        </div>
        <div className={styles.Input__error}>
          {
            meta.touched && meta.error ?
              meta.error :
              error || ' '
          }
        </div>
      </div>
    );
  }
}

export default Input;

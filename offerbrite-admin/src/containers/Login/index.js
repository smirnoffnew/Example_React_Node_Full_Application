import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Input from 'components/Input';
import Checkbox from 'components/Checkbox';
import Button from 'components/UI/Button';
import styles from './styles.module.scss';
import logo from 'assets/images/logo-blue.svg';

import { actions as sessionActions } from 'reducers/session';

class Login extends Component {

  componentDidUpdate(prevProps) {
    if (!prevProps.token && this.props.token && this.props.history.location.pathname === '/admin/login') {
      this.props.history.push('/admin/users');
    }
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.login();
  }

  render() {
    const { email, password, onChangeText, rememberSession, onToggleRememberSession } = this.props;
    return (
      <div className={styles.Login}>
        <div className={styles.Login__logo}>
          <img src={logo} alt="Logo" />
          <h2 className={styles.Login__header}>Admin panel</h2>
        </div>
        <form className={styles.Login__form}>
          <div className={styles.Login__form__container}>
            <Input
              onChange={e => onChangeText(e, 'email')}
              value={email}
              type="text"
              placeholder="Email"
            />
            <Input
              onChange={e => onChangeText(e, 'password')}
              value={password}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={styles.Login__form__checkbox}>
            <Checkbox
              checked={rememberSession}
              onClick={onToggleRememberSession}
              label="Remember me"
            />
          </div>
          <div className={styles.Login__form__button}>
            <Button
              orange
              block
              disabled={email.length === 0 || password.length === 0}
              onClick={this.handleSubmit}
            >
              Enter
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { email, password, rememberSession, access } = state.session;

  return {
    email,
    password,
    rememberSession,
    token: access.token,
  };
};

const mapDispatchToProps = dispatch => ({
  onChangeText: (e, inputName) => dispatch(sessionActions.onChangeText(e, inputName)),
  onToggleRememberSession: () => dispatch(sessionActions.onToggleRememberSession()),
  login: () => dispatch(sessionActions.login()),
});

Login.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  rememberSession: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));

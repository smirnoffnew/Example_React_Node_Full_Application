import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';

import logoDanger from '../../assets/icons/logo-red.svg';
import logoPrimary from '../../assets/icons/logo-blue.svg';
import styles from './styles.css';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

import { passwordValidation } from '../../services/helpers/inputDataValidation';
import { API_URL } from '../../services/config';

const logo = {
  danger: logoDanger,
  primary: logoPrimary,
};

class PasswordRecovery extends Component {

  state = {
    passwordDoesNotMatch: false,
    token: this.props.location.search.replace('?token=', ''),
    isModalVisible: false,
    loading: false,
    error: false,
  }

  onSubmit = values => {
    if (values.password !== values.confirmedPassword) {
      this.setState({ passwordDoesNotMatch: true });
    } else {
      this.setState({ passwordDoesNotMatch: false });
      this.putPassword({ password: values.password });
    }
  }

  putPassword = data => {
    this.setState({ loading: true });

    axios({
      url: `${API_URL}/auth/${this.props.businessRoute ? 'business-users/' : ''}reset-password`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      data,
    })
      .then(() => {
        this.setState({ error: false, isModalVisible: true, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, isModalVisible: true, loading: false });
      });
  }

  onCloseModalHandler = () => {
    this.setState({ isModalVisible: false });
  }

  render() {
    const { handleSubmit, businessRoute } = this.props;
    const { error, isModalVisible, loading } = this.state;
    const theme = businessRoute ? 'primary' : 'danger';

    return (
      <Fragment>
        {
          loading ? <Loader /> : null
        }
        <Modal
          onClose={this.onCloseModalHandler}
          isVisible={isModalVisible}
          message={
            error ?
              'Something went wrong. Try again please.' :
              'Ok, now you can log in with this password.'
          }
          buttonTheme={error ? 'danger' : 'primary'}
        />
        <div className={styles.PasswordRecovery}>
          <Card>
            <img src={logo[theme]} className={styles.PasswordRecovery__logo} alt="logo" />
            <h1 className={styles.PasswordRecovery__title}>Welcome to Offerbrite</h1>
            <p className={styles.PasswordRecovery__intro}>
              Create new password here
          </p>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                label="New password"
                name="password"
                component={Input}
                theme={theme}
                id="newPassword"
                validate={passwordValidation}
              />
              <Field
                label="Confirm password"
                name="confirmedPassword"
                component={Input}
                theme={theme}
                id="confirmedPassword"
                error={this.state.passwordDoesNotMatch ? 'Password doesn\'t match' : null}
              />
              <Button
                theme={theme}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default reduxForm({ form: 'passwordRecovery' })(PasswordRecovery);

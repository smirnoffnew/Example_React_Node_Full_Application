import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './styles.module.scss';
import arrowDownIcon from 'assets/icons/arrow-down.svg';

import { actions as sessionActions } from 'reducers/session';

class Header extends Component {
  state = {
    isDropDownVisible: false,
  };

  onToggleDropDown = () => {
    this.setState(prevState => ({
      isDropDownVisible: !prevState.isDropDownVisible,
    }));
  };

  handleLogoutClick = () => {
    this.onToggleDropDown();
    this.props.history.replace('/admin/login');
    this.props.logout();
  };

  render() {
    const { admin } = this.props;
    const { isDropDownVisible } = this.state;

    return (
      <div className={styles.Header}>
        <div className={styles.Header__dropdown}>
          <div
            className={styles.Header__dropdown__row}
            onClick={this.onToggleDropDown}
          >
            {admin.username}
            <div className={styles.Header__dropdown__arrow}>
              <img src={arrowDownIcon} alt="Arrow icon" />
            </div>
          </div>
          <div
            className={[
              styles.Header__dropdown__row,
              isDropDownVisible ? null : styles.Header__dropdown__row__hidden,
            ].join(' ')}
            onClick={this.handleLogoutClick}
          >
            Logout
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  admin: PropTypes.object,
};

const mapStateToProps = state => ({
  admin: state.session.admin,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(sessionActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PageTitle from 'components/PageTitle';
import Button from 'components/UI/Button';
import Modal from 'components/UI/Modal';
import { NotificationForm } from 'components/Forms';
import { NotificationsTable } from 'components/Tables';
import styles from './styles.module.scss';

import { actions as notificationFormActions } from 'reducers/notificationForm';

class Notifications extends Component {
  state = {
    isFormVisible: false,
  }

  componentDidMount() {
    this.props.getNotifications();
  }

  onToggleForm = () => {
    this.setState(prevState => ({ isFormVisible: !prevState.isFormVisible }));
  }

  render() {
    const { isFormVisible } = this.state;
    const { notificationsList, deleteNotification } = this.props;

    return (
      <div className={styles.Notifications}>
        <PageTitle title="Notifications" />
        <div className={styles.Notifications__content}>
          <p className={styles.Notifications__description}>
            You can enter your text and set individual
            user groups by country or favorite category
          </p>
          <div className={styles.Notifications__button}>
            <Button onClick={this.onToggleForm}>
              Create
            </Button>
          </div>
          {
            notificationsList.length > 0 &&
            <div className={styles.Notifications__table}>
              <NotificationsTable
                data={notificationsList}
                onDelete={deleteNotification}
              />
            </div>
          }
          <Modal
            isVisible={isFormVisible}
            onClose={this.onToggleForm}
            header="Create notification"
          >
            <NotificationForm onClose={this.onToggleForm} />
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notificationsList: state.notificationForm.notificationsList,
});

const mapDispatchToProps = dispatch => ({
  getNotifications: () => dispatch(notificationFormActions.getNotifications()),
  deleteNotification: notificationId => dispatch(notificationFormActions.deleteNotification(notificationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

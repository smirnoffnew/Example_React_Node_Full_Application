import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from 'components/Input';
import Datepicker from 'components/Datepicker';
import Button from 'components/UI/Button';
import Dropdown from 'components/UI/Dropdown';
import Section from 'components/UI/Section';
import styles from './styles.module.scss';

import { TIME_CONSTANTS } from 'services/helpers';
import { actions as notificationFormActions } from 'reducers/notificationForm';

class Notification extends Component {

  handleSubmit = () => {
    this.props.sendNotification();
    this.props.onClose();
  }

  render() {
    const {
      title,
      text,
      selectedCountry,
      countries,
      selectedCategory,
      categories,
      date,
      time,
      onChangeNotificationText,
      onChangeNotificationCountry,
      onChangeNotificationCategory,
      onChangeNotificationDate,
      onChangeNotificationTime,
    } = this.props;

    return (
      <div className={styles.NotificationForm}>
        <div className={styles.NotificationForm__form}>
          <Section header="Notice text">
            <Input
              placeholder="Header"
              label="Header (optional)"
              onChange={e => onChangeNotificationText(e, 'title')}
              value={title}
            />
            <Input
              placeholder="Text"
              label="Text"
              inputtype="textarea"
              onChange={e => onChangeNotificationText(e, 'text')}
              value={text}
            />
          </Section>
          <Section header="Targeting">
            <div className={styles.NotificationForm__dropdowns}>
              <Dropdown
                title={selectedCategory}
                values={categories}
                onSelect={onChangeNotificationCategory}
                label="Favorite user's category"
              />
              <Dropdown
                title={selectedCountry}
                values={countries}
                onSelect={onChangeNotificationCountry}
                label="Country"
              />
            </div>
          </Section>
          <Section header="Notification settings">
            <div className={styles.NotificationForm__pickers}>
              <Datepicker
                selected={date}
                dateFormat="yyyy/MM/dd"
                onChange={onChangeNotificationDate}
                minDate={new Date()}
                maxDate={new Date(Date.now() + TIME_CONSTANTS.MONTH)}
              />
              <Datepicker
                selected={time}
                onChange={onChangeNotificationTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                timeCaption="Time"
              />
            </div>
            <div className={styles.NotificationForm__form__button}>
              <Button block onClick={this.handleSubmit} disabled={text.length === 0}>
                Send
              </Button>
            </div>
          </Section>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  title: state.notificationForm.title,
  text: state.notificationForm.text,
  selectedCountry: state.notificationForm.selectedCountry,
  countries: state.notificationForm.countries,
  selectedCategory: state.notificationForm.selectedCategory,
  categories: state.notificationForm.categories,
  date: state.notificationForm.date,
  time: state.notificationForm.time,
});

const mapDispatchToProps = dispatch => ({
  onChangeNotificationText: (e, fieldTitle) => dispatch(notificationFormActions.onChangeNotificationText(e, fieldTitle)),
  onChangeNotificationCountry: country => dispatch(notificationFormActions.onChangeNotificationCountry(country)),
  onChangeNotificationCategory: category => dispatch(notificationFormActions.onChangeNotificationCategory(category)),
  onChangeNotificationDate: date => dispatch(notificationFormActions.onChangeNotificationDate(date)),
  onChangeNotificationTime: time => dispatch(notificationFormActions.onChangeNotificationTime(time)),
  sendNotification: () => dispatch(notificationFormActions.sendNotification()),
});

Notification.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export const NotificationForm = connect(mapStateToProps, mapDispatchToProps)(Notification);

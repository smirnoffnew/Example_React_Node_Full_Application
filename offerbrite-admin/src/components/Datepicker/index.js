import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import styles from './styles.module.scss';

export default class Datepicker extends Component {
  state = {
    styles: styles.Datepicker_blured,
  }

  handleFocus = () => {
    this.setState({ styles: styles.Datepicker_focused });
  }

  handleBlur = () => {
    this.setState({ styles: styles.Datepicker_blured });
  }

  render() {
    return (
      <DatePicker
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={[styles.Datepicker, this.state.styles].join(' ')}
        {...this.props}
      />
    );
  }
}

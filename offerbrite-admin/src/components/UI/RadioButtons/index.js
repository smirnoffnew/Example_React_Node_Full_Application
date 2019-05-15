import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import styles from './styles.module.scss';

class RadioButtons extends Component {
  state = {
    selected: 0,
  }

  handleClick = (value, index) => {
    this.setState({ selected: index });
    this.props.onSelect(value);
  }

  render() {
    const { selected } = this.state;
    const { values } = this.props;

    return (
      <div className={styles.RadioButtons}>
        {
          values.map((value, index) => (
            <div
              key={index}
              className={styles.RadioButtons__button}
              onClick={() => this.handleClick(value, index)}
            >
              {
                selected === index ?
                  <MdRadioButtonChecked className={styles.RadioButtons__icon} /> :
                  <MdRadioButtonUnchecked className={styles.RadioButtons__icon} />
              }
              {value}
            </div>
          ))
        }
      </div>
    );
  }
}

RadioButtons.propTypes = {
  values: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RadioButtons;

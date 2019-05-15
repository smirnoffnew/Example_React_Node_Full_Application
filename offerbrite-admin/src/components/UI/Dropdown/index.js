import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { MdArrowDropDown } from 'react-icons/md';
import styles from './styles.module.scss';

class Dropdown extends Component {
  state = {
    isOpened: false,
  }

  onToggle = () => {
    this.setState(prevState => ({ isOpened: !prevState.isOpened }));
  }

  handleSelect = value => {
    this.onToggle();
    this.props.onSelect(value, this.props.dataSelector);
  }

  render() {
    const { isOpened } = this.state;
    const { title, values, small, label, width } = this.props;

    return (
      <div
        className={[styles.Dropdown, small ? styles.Dropdown_small : null].join(' ')}
        style={width ? { width } : null}
      >
        <div
          onClick={this.onToggle}
          className={[
            styles.Dropdown__row_first,
            small ? styles.Dropdown__row_first_small : null,
            isOpened ? styles.Dropdown__row_first_opened : styles.Dropdown__row_first_closed,
          ].join(' ')}
        >
          {
            label ?
            <div>
              <div className={styles.Dropdown__label}>{label}</div>
              {title}
            </div> :
            title
          }
          <div className={[
            styles.Dropdown__icon__wrapper,
            isOpened ? styles.Dropdown__icon__wrapper_rotated : null
          ].join(' ')}>
            <MdArrowDropDown className={styles.Dropdown__icon} />
          </div>
        </div>
        <div
          className={[
            styles.Dropdown__list,
            !isOpened ? styles.Dropdown__list_closed : null,
          ].join(' ')}
          style={!isOpened ?
            { height: 0, overflowY: 'hidden' } :
            { height: `${values.length * 48}px`, overflowY: values.length > 5 ? 'scroll' : 'hidden' }
          }
        >
          {
            values.map((value, index) => (
              <div
                key={index}
                onClick={() => this.handleSelect(value)}
                className={styles.Dropdown__list__item}
              >
                {value}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {

};

export default Dropdown;

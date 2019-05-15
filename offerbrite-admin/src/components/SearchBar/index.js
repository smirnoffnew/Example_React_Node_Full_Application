import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdSearch } from 'react-icons/md';
import styles from './styles.module.scss';

class SearchBar extends Component {
  state = {
    isFocused: false,
  };

  onToggleFocus = () => {
    this.setState(prevState => ({ isFocused: !prevState.isFocused }));
  };

  render() {
    const { isFocused } = this.state;
    const { placeholder, value, onChange } = this.props;

    return (
      <div className={[
        styles.SearchBar,
        isFocused ? styles.SearchBar_focused : styles.SearchBar_blured,
      ].join(' ')}>
        <MdSearch className={styles.SearchBar__icon} />
        <input
          className={styles.SearchBar__input}
          placeholder={placeholder}
          onFocus={this.onToggleFocus}
          onBlur={this.onToggleFocus}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;

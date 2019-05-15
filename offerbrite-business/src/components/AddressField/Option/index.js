import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import TextContent from '@/components/TextContent';
import styles from './styles';

import { formatAddress } from '@/services/helpers/geolocation';

class Option extends Component {

  _onSelectHandler = () => {
    this.props.fetchDetails(this.props.place_id)
      .then(response => {
        this.props.onPress(formatAddress(response), this.props.index);
        this.props.hideOptions();
      });
  }

  render() {
    const { address } = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._onSelectHandler}
      >
        <TextContent type="subtext">{address}</TextContent>
      </TouchableOpacity>
    );
  }
}

Option.propTypes = {
  address: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

export default Option;

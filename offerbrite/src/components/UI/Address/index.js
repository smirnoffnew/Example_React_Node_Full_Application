import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Icon } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import styles from './styles';

export default function Address({ location, onPress }) {
  const { address } = location;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            name="ios-pin"
            style={styles.icon}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.textElement, styles.textRed]}>
            {`${address.city}${address.street !== '' ? ', ' : ''}`}
          </Text>
          {
            address.street !== '' &&
            <Text style={[styles.textElement, styles.textDefault]}>
              {`${address.street}${address.building !== '' ? ', ' : ''}`}
            </Text>
          }
          {
            address.building !== '' &&
            <Text style={[styles.textElement, styles.textDefault]}>
              {address.building}
            </Text>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

Address.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.object.isRequired,
    position: PropTypes.exact({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  }),
  onPress: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { Icon, View } from 'native-base';
import styles from './styles';

export default function ButtonAlert({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Icon
          name="md-alert"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

ButtonAlert.propTypes = {
  onPress: PropTypes.func,
};

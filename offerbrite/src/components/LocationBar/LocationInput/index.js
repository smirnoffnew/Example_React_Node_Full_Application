import React from 'react';
import PropTypes from 'prop-types';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { View, Icon } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function LocationInput(props) {
  const { userLocation, onEraseContent, header } = props;
  const statusBarHeight = getStatusBarHeight(true);

  return (
    <View style={[
      styles.container,
      { paddingTop: header ? 10 + statusBarHeight : 10 },
    ]}>
      <View style={styles.locationInput}>
        <View style={styles.iconLeftContainer}>
          <Icon
            name="pin"
            style={styles.icon}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={userLocation.addressWithoutZIP || 'Your current location'}
            placeholderTextColor="#fff"
            underlineColorAndroid="transparent"
            {...props}
          />
        </View>
        <TouchableOpacity
          style={styles.iconRightContainer}
          onPress={onEraseContent}
        >
          <Icon
            name="close-circle"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

LocationInput.propTypes = {
  userLocation: PropTypes.shape({
    addressWithoutZIP: PropTypes.string,
  }),
  onEraseContent: PropTypes.func,
  header: PropTypes.bool,
};

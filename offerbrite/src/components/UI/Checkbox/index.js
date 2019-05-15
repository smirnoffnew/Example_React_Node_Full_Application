import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { View, Icon } from 'native-base';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function Checkbox({ checked, title, onPress, position }) {
  return (
    <View style={[styles.container, styles[position]]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.checkbox}
      >
        <View style={styles.iconContainer}>
          {
            checked ?
              <Icon
                name="md-checkmark"
                style={styles.icon}
              /> :
              null
          }
        </View>
        <TextContent type="regular" color="dark">{title}</TextContent>
      </TouchableOpacity>
    </View>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'center',
    'left',
    'right',
  ]).isRequired,
};

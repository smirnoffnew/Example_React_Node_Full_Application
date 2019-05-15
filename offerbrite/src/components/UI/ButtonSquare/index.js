import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';

export default function ButtonSquare({ danger, light, gray, onPress, children, smallHeight, iconName }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        smallHeight ? styles.smallHeight : styles.normalHeight,
        danger ? styles.buttonDanger : gray ? styles.buttonGray : styles.buttonLight,
      ]}
    >
      {
        iconName &&
        <Icon
          name={iconName}
          style={[
            styles.icon,
            danger ? styles.iconDanger : styles.iconLight
          ]}
        />
      }
      <Text style={[
        styles.text,
        danger ? styles.textLight : gray ? styles.textGray : styles.textDanger,
      ]}>{children}</Text>
    </TouchableOpacity>
  );
}

ButtonSquare.propTypes = {
  danger: PropTypes.bool,
  light: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  smallHeight: PropTypes.bool,
  iconName: PropTypes.string,
};

import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';

export default function ButtonSquare({ primary, light, gray, danger, onPress, children, smallHeight, iconName }) {
  const {
    buttonPrimary,
    buttonGray,
    buttonLight,
    buttonDanger,
    textLight,
    textGray,
    textPrimary,
  } = styles;

  let buttonColorStyle, textColorStyle;
  switch (true) {
    case primary:
      buttonColorStyle = buttonPrimary;
      textColorStyle = textLight;
      break;
    case gray:
      buttonColorStyle = buttonGray;
      textColorStyle = textGray;
      break;
    case danger:
      buttonColorStyle = buttonDanger;
      textColorStyle = textLight;
      break;
    default:
      buttonColorStyle = buttonLight;
      textColorStyle = textPrimary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        smallHeight ? styles.smallHeight : styles.normalHeight,
        buttonColorStyle,
      ]}
    >
      {
        iconName &&
        <Icon
          name={iconName}
          style={[
            styles.icon,
            primary ? styles.iconPrimary : styles.iconLight
          ]}
        />
      }
      <Text style={[styles.text, textColorStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

ButtonSquare.propTypes = {
  primary: PropTypes.bool,
  light: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  smallHeight: PropTypes.bool,
  iconName: PropTypes.string,
};

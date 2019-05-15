import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';

import toCapitalize from '@/services/helpers/toCapitalize';

export default function ButtonTransparent({ children, onPress, position, danger, primary }) {
  return (
    <View style={[styles.container, styles[position]]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          danger ? styles.danger : primary ? styles.primary : styles.default,
        ]}
      >
        <Text style={[
          styles.text,
          danger ? styles.textDanger : primary ? styles.textPrimary : styles.textDefault,
        ]}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

ButtonTransparent.propTypes = {
  children: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'left',
    'center',
    'right',
  ]).isRequired,
  danger: PropTypes.bool,
  primary: PropTypes.bool,
};

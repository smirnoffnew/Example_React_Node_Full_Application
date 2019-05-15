import React from 'react';
import PropTypes from 'prop-types';

import { TouchableHighlight, View, Text } from 'react-native';
import styles from './styles';
import appTheme from '@/theme';

export default function ButtonRounded({ children, onPress, theme, square }) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={theme === 'disabled' ? () => { } : onPress}
        style={[styles.button, styles[theme], square ? styles.square : styles.rounded]}
        underlayColor={appTheme[
          theme === 'disabled' ? 'disabled' : `${theme}Dark`
        ]}
      >
        <Text style={styles.text}>{children.toUpperCase()}</Text>
      </TouchableHighlight>
    </View>
  );
}

ButtonRounded.propTypes = {
  children: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  theme: PropTypes.oneOf([
    'danger',
    'primary',
    'disabled'
  ]).isRequired,
  square: PropTypes.bool,
};

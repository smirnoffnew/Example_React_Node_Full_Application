import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { Icon, View } from 'native-base';
import styles from './styles';

export default function ButtonFavorite({ active, onPress, header }) {
  const buttonStyle = [styles.button];

  if (!active) {
    buttonStyle.push(styles.buttonDefault);
  } else if (active && header) {
    buttonStyle.push(styles.buttonActiveHeader);
  } else if (active) {
    buttonStyle.push(styles.buttonActive);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
      >
        <Icon
          name="md-star"
          style={[
            styles.icon,
            active ? styles.iconActive : styles.iconDefault,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

ButtonFavorite.propTypes = {
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

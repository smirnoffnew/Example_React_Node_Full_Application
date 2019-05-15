import React, { Fragment } from 'react';
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
        <Fragment>
          <View style={styles.iconContainerOuter}>
            <View style={[
              styles.iconContainerInner,
              checked ? styles.primary : styles.light,
            ]}>
              {
                checked ?
                  <Icon
                    name="md-checkmark"
                    style={styles.icon}
                  /> :
                  null
              }
            </View>
          </View>
          <TextContent type="subtext">{title}</TextContent>
        </Fragment>
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

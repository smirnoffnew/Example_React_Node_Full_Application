import React from 'react';
import PropTypes from 'prop-types';

import { Text, View } from 'native-base';
import Button from '@/components/UI/Button';
import styles from './styles';

export default function Segment({
  active,
  onPress,
  titleLeft,
  titleRight,
  rippleActive,
  rippleDefault,
}) {
  return (
    <View style={styles.container}>
      <Button
        style={[
          styles.button,
          styles.left,
          active === 'left' ? styles.active : styles.default,
        ]}
        onPress={() => onPress('left')}
        rippleColor={active === 'left' ? rippleActive : rippleDefault}
      >
        <Text style={[styles.text, active === 'left' ? styles.textActive : styles.textDefault]}>
          {titleLeft}
        </Text>
      </Button>
      <Button
        onPress={() => onPress('right')}
        style={[
          styles.button,
          styles.right,
          active === 'right' ? styles.active : styles.default,
        ]}
        rippleColor={active === 'right' ? rippleActive : rippleDefault}
      >
        <Text style={[styles.text, active === 'right' ? styles.textActive : styles.textDefault]}>
          {titleRight}
        </Text>
      </Button>
    </View>
  );
}

Segment.propTypes = {
  active: PropTypes.oneOf([
    'left',
    'right',
  ]).isRequired,
  onPress: PropTypes.func.isRequired,
  titleLeft: PropTypes.string.isRequired,
  titleRight: PropTypes.string.isRequired,
  rippleActive: PropTypes.string,
  rippleDefault: PropTypes.string,
};

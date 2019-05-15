import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'native-base';
import styles from './styles';

export default function ContainerCenter({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

ContainerCenter.propTypes = {
  children: PropTypes.node,
};

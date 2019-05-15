import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'native-base';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function ListClauseSeparator({ children }) {
  return (
    <View style={styles.container}>
      <TextContent type="subtext">{children || ' '}</TextContent>
    </View>
  );
}

ListClauseSeparator.propTypes = {
  children: PropTypes.string,
};

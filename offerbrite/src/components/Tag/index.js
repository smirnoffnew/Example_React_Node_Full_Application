import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function Tag({ tag, onPress }) {
  return (
    <TouchableOpacity
      style={styles.tag}
      onPress={onPress}
    >
      <TextContent
        type="subtext"
        color="default"
      >
        {tag}
      </TextContent>
    </TouchableOpacity>
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

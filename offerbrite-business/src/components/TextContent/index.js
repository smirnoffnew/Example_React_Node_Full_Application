import React from 'react';
import PropTypes from 'prop-types';

import { Text, View } from 'native-base';
import styles from './styles';
import appTheme from '@/theme';

export default function TextContent({ type, children, style, color, bold, center }) {
  return (
    <View style={style}>
      <Text style={[
        styles[type],
        { color: color ? appTheme[color] : appTheme.default },
        bold ? { fontWeight: '900' } : null,
        center ? { textAlign: 'center' } : null,
      ]}>
        {children}
      </Text>
    </View>
  );
}

TextContent.propTypes = {
  type: PropTypes.oneOf([
    'regular',
    'regularSmall',
    'subtext',
    'small'
  ]).isRequired,
  color: PropTypes.oneOf([
    'light', 'primary', 'danger', 'default', 'disabled', 'gray', 'dark', 'darkGray',
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  bold: PropTypes.bool,
  center: PropTypes.bool,
};

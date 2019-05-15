import React from 'react';
import PropTypes from 'prop-types';

import { Text, View } from 'native-base';
import appTheme from '@/theme';

export default function TextContent({ type, color, bold, children, style, center }) {
  return (
    <View style={style}>
      <Text style={[
        {
          color: color ? appTheme[color] : appTheme.default,
          fontSize: appTheme.textSizes[type],
        },
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
    'subtext',
    'small',
  ]).isRequired,
  children: PropTypes.string,
  center: PropTypes.bool,
  bold: PropTypes.bool,
  color: PropTypes.oneOf([
    'light',
    'lightDark',
    'dark',
    'primary',
    'primaryDark',
    'danger',
    'dangerLight',
    'dangerDark',
    'default',
    'darkGray',
    'disabled',
  ]),
};

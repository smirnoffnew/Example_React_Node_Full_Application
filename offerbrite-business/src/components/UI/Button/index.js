import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { TouchableNativeFeedback, TouchableOpacity, Platform, View } from 'react-native';
import appTheme from '@/theme';

export default function Button({ style, children, onPress, rippleColor }) {
  return (
    <Fragment>
      {
        Platform.OS === 'ios' || Platform.OS === 'android' ? // TODO: remove `android` condition
          <TouchableOpacity
            style={style}
            onPress={onPress}
            activeOpacity={0.6}
          >
            {children}
          </TouchableOpacity> :
          <TouchableNativeFeedback
            onPress={onPress}
            background={TouchableNativeFeedback.Ripple(rippleColor)}
          >
            <View style={style}>{children}</View>
          </TouchableNativeFeedback>
      }
    </Fragment>
  );
}

Button.defaultProps = {
  rippleColor: appTheme.default,
};

Button.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func.isRequired,
  rippleColor: PropTypes.string,
};

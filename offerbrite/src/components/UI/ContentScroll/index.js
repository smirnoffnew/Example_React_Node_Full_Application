import React from 'react';
import PropTypes from 'prop-types';

import { Content } from 'native-base';
import styles from './styles';

export default function ContentScroll({ children, style }) {
  return (
    <Content contentContainerStyle={[styles.content, style]}>
      {children}
    </Content>
  );
}

ContentScroll.propTypes = {
  children: PropTypes.node,
};

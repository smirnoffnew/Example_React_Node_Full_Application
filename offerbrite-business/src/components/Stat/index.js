import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'native-base';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function Stat({ title, label, count }) {
  return (
    <Fragment>
      <TextContent
        bold
        type="regularSmall"
        color="dark"
        style={styles.statTitle}
      >
        {title}
      </TextContent>
      <View style={styles.statsContent}>
        <TextContent
          type="small"
          color="default"
          style={styles.statsLabel}
        >
          {label}
        </TextContent>
        <Text style={styles.statsCount}>
          {count}
        </Text>
      </View>
    </Fragment>
  );
}

Stat.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

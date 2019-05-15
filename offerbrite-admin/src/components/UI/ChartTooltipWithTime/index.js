import React from 'react';

import { makeTimeFromSeconds } from 'services/helpers';
import styles from './styles.module.scss';

const ChartTooltipWithTime = props => {
  const { active } = props;

  if (active) {
    const { payload, label } = props;
    return (
      <div className={styles.Tooltip}>
        <p>{label}</p>
        <p className={styles.Tooltip__value}>{`duration: ${makeTimeFromSeconds(parseInt(payload[0].value))}`}</p>
      </div>
    );
  }

  return null;
};

export default ChartTooltipWithTime;

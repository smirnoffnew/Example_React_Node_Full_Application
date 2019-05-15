import React from 'react';

import Dropdown from 'components/UI/Dropdown';
import ProgressBar from 'components/UI/ProgressBar';
import styles from './styles.module.scss';

export const SessionsByCountry = ({ data, totalSessions, onChangeTime, time, times }) => (
  <div className={styles.Chart} style={{ height: data.length * 80 }}>      
    <div className={styles.Chart__header}>
      <h3 className={styles.Chart__header__text}>Sessions by country</h3>
      <Dropdown
        title={time}
        values={times}
        onSelect={onChangeTime}
        dataSelector="sessionsByCountry"
        small
      />
    </div>
    {
      data.map(session => (
        <ProgressBar
          key={session.country}
          label={session.country}
          count={session.count}
          percent={session.count / totalSessions * 100}
          tooltipName="sessions"
        />
      ))
    }
  </div>
);

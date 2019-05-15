import React from 'react';

import { MdSmartphone } from 'react-icons/md';
import Dropdown from 'components/UI/Dropdown';
import StatBox from 'components/UI/StatBox';
import styles from './styles.module.scss';

export const SessionsByDevice = ({ data, onChangeTime, time, times }) => (
  <div className={styles.Table}>      
    <div className={styles.Table__header}>
      <h3 className={styles.Table__header__text}>Sessions by device</h3>
      <Dropdown
        title={time}
        values={times}
        onSelect={onChangeTime}
        dataSelector="sessionsByDevice"
        small
      />
    </div>
    <div className={styles.Table__data}>
      {
        data.map((session, index) => (
          <StatBox
            key={index}
            label={session.device || 'Samsung'}
            value={session.count || 4}
            icon={<MdSmartphone className={styles.Table__data__icon} />}
            additionalValue={session.percent || '25%'}
          />
        ))
      }
    </div>
  </div>
);
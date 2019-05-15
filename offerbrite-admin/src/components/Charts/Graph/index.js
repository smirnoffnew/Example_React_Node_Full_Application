import React from 'react';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Dropdown from 'components/UI/Dropdown';
import StatBox from 'components/UI/StatBox';
import ChartTooltipWithTime from 'components/UI/ChartTooltipWithTime';
import styles from './styles.module.scss';

export const Graph = props => {
  const { data, userStats, onChangeTime, time, times, onChangeGraph, activeMode, graphModes } = props;
  const { data: statData, previousData } = userStats;
  
  const formattedStats = Object.keys(statData).map(key => {
    let percent = 0;
    if (previousData && previousData.hasOwnProperty(key)) {
      if (key === 'Session duration') {
        return {
          label: key,
          count: statData[key],
          percent: statData.sessionInSeconds / previousData.sessionInSeconds * 100 - 100 || 0,
        }
      }
      percent = statData[key] / previousData[key] * 100 - 100;
    }
    
    return {
      label: key,
      count: statData[key],
      percent,
    };
  });

  let tooltip = <Tooltip />;
  if (activeMode === 'Session duration') {
    tooltip = <Tooltip content={<ChartTooltipWithTime />} />;
  }

  return (
  <div className={styles.Chart}>      
    <div className={styles.Chart__container}>
      <div className={styles.Chart__header}>
        <Dropdown
          title={activeMode}
          values={graphModes}
          onSelect={onChangeGraph}
          small
        />
        <Dropdown
          title={time}
          values={times}
          onSelect={onChangeTime}
          dataSelector="sessions"
          small
        />
      </div>
      <ResponsiveContainer width="100%" minWidth={600} height="80%">
        <LineChart data={data} margin={{ top: 5, right: 50, bottom: 5, left: 0 }}>
          <Line
            type="linear"
            dataKey="count"
            name={activeMode === 'Users' ? 'users' : 'sessions'}
            stroke="#FFB018"
            strokeWidth={3}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          {tooltip}
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className={styles.Chart__data}>
      {
        formattedStats.map((stat, index) => {
          if (stat.label !== 'sessionInSeconds') {

            return (
              <StatBox
                key={index}
                label={stat.label || ''}
                value={stat.count || 0}
                additionalValue={
                  stat.percent > 0
                    ? `↑ ${stat.percent.toFixed(1)}%`
                    : stat.percent < 0
                      ? `↓ ${Math.abs(stat.percent).toFixed(1)}%`
                      : ''
                }
              />
            );
          }
          return null;
        })
      }
    </div>
  </div>
  );
};
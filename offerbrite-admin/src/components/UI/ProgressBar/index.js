import React, { Component } from 'react';

import { Progress } from 'react-sweet-progress';
import Tooltip from 'react-tooltip-lite';
import 'react-sweet-progress/lib/style.css';
import styles from './styles.module.scss';

class ProgressBar extends Component {
  render() {
    const { label, percent, count, tooltipName } = this.props;

    return (
      <div className={styles.ProgressBar}>
        <div className={styles.ProgressBar__label}>
          {label}
        </div>
        <div className={styles.ProgressBar__bar}>
          <Tooltip
            tagName="div"
            padding="20px"
            content={<div className={styles.ProgressBar__tooltip}>{`${tooltipName}: ${count}`}</div>}
          >
            <Progress
              percent={percent}
              status="error"
              theme={{
                error: {
                  color: '#fbc630'
                }
              }}
              symbolClassName={styles.ProgressBar__bar__symbol}
            />
          </Tooltip>
        </div>
        <div className={styles.ProgressBar__description}>
          {`${percent.toFixed(1)}%`}
        </div>
      
      </div>
    );
  }
}

export default ProgressBar;

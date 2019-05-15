import React from 'react';

import Tooltip from 'react-tooltip-lite';
import { MdInfo } from 'react-icons/md';
import styles from './styles.module.scss';

const TextWithTooltip = ({ text, tip }) => (
  <div className={styles.TextWithTooltip}>
    {text}
    <Tooltip useDefaultStyles content={tip}>
      <MdInfo className={styles.TextWithTooltip__icon} />
    </Tooltip>
  </div>  
);

export default TextWithTooltip;

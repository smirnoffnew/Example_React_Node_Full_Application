import React from 'react';

import ReactTable from 'react-table';
import Dropdown from 'components/UI/Dropdown';
import TextWithTooltip from 'components/UI/TextWithTooltip';
import styles from './styles.module.scss';

export const AnalyticsScreenTable = ({ data, time, times, onChangeTime }) => {
  const columns = [
    {
      Header: (
        <TextWithTooltip
          text="Screen name"
          tip="The name of a specific app screen."
        />
      ),
      Cell: props => props.value,
      accessor: 'name',
      headerClassName: 'Table__cell__header',
    },
    {
      Header: (
        <TextWithTooltip
          text="Screen views"
          tip="The total number of screens viewed. Repeated views of a single screen are counted."
        />
      ),
      Cell: props => props.value,
      accessor: 'views',
      headerClassName: 'Table__cell__header',
      sortable: false,
    },
    {
      Header: (
        <TextWithTooltip
          text="Unique screen views"
          tip="The number of sessions during which the specified screen(s) are viewed at least once. Multiple viewings of a screen are counted as a single Unique Screenview."
        />
      ),
      Cell: props => props.value,
      accessor: 'uniqViews',
      headerClassName: 'Table__cell__header',
      sortable: false,
    },
    {
      Header: (
        <TextWithTooltip
          text="Avg. Time on screen"
          tip="The average amount of time users spent on a screen."
        />
      ),
      Cell: props => props.value,
      accessor: 'avgDuration',
      headerClassName: 'Table__cell__header',
    },
    {
      Header: (
        <TextWithTooltip
          text="% Exits"
          tip="%Exit is (number of exits) / (number of pageviews) for the page or set of pages. It indicates how often users exit from that page or set of pages when they view the page(s)."
        />
      ),
      Cell: props => props.value,
      accessor: 'exitPercent',
      headerClassName: 'Table__cell__header',
      sortable: false,
    },
  ];

  return (
    <div className={styles.Table}>
      <div className={styles.Table__header}>
        <h3 className={styles.Table__header__text}>Screen support</h3>
        <Dropdown
          title={time}
          values={times}
          onSelect={onChangeTime}
          dataSelector="screenSupport"
          small
        />
      </div>
      <ReactTable
        className="-highlight"
        data={data}
        minRows={data.length}
        columns={columns}
        showPaginationBottom={false}
      />
    </div>
    
  );
};

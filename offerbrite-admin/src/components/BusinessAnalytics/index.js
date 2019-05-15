import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Graph, SessionsByDevice, SessionsByCountry } from 'components/Charts';
import { AnalyticsScreenTable } from 'components/Tables';
import styles from './styles.module.scss';

import { actions as analyticsBusinessActions } from 'reducers/analyticsBusiness';

class BusinessAnalytics extends Component {
  componentDidMount() {
    this.props.getSessions();
    this.props.getSessionsByDevice();
    this.props.getUserStats();
    this.props.getUsersGraph();
    this.props.getSessionDurationGraph();
    this.props.getSessionsByCountry();
    this.props.getScreenSupport();
  }

  render() {
    const {
      sessions,
      usersGraph,
      sessionDurationGraph,
      userStats,
      sessionsByDevice,
      sessionsByCountry,
      screenSupport,
      onChangeRequestedTime,
      onChangeGraphMode,
      selectedGraphMode,
      graphModes,
    } = this.props;

    let graphData = sessions.data;
    if (selectedGraphMode === 'Users') {
      graphData = usersGraph.data;
    } else if (selectedGraphMode === 'Session duration') {
      graphData = sessionDurationGraph.data;
    }

    return (
      <div className={styles.BusinessAnalytics}>
        <Graph
          data={graphData}
          onChangeTime={onChangeRequestedTime}
          times={sessions.times}
          time={sessions.requestedTime}
          userStats={userStats}
          onChangeGraph={onChangeGraphMode}
          activeMode={selectedGraphMode}
          graphModes={graphModes}
        />
        <SessionsByDevice
          data={sessionsByDevice.data}
          onChangeTime={onChangeRequestedTime}
          times={sessionsByDevice.times}
          time={sessionsByDevice.requestedTime}
        />
        <AnalyticsScreenTable
          data={screenSupport.data}
          onChangeTime={onChangeRequestedTime}
          times={screenSupport.times}
          time={screenSupport.requestedTime}
        />
        <SessionsByCountry
          data={sessionsByCountry.data}
          totalSessions={sessionsByCountry.data.reduce((prev, cur) => prev + cur.count, 0)}
          onChangeTime={onChangeRequestedTime}
          times={sessionsByCountry.times}
          time={sessionsByCountry.requestedTime}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  graphModes: state.analyticsBusiness.graphModes,
  selectedGraphMode: state.analyticsBusiness.selectedGraphMode,
  sessions: state.analyticsBusiness.sessions,
  usersGraph: state.analyticsBusiness.usersGraph,
  sessionDurationGraph: state.analyticsBusiness.sessionDurationGraph,
  sessionsByDevice: state.analyticsBusiness.sessionsByDevice,
  sessionsByCountry: state.analyticsBusiness.sessionsByCountry,
  screenSupport: state.analyticsBusiness.screenSupport,
  userStats: state.analyticsBusiness.userStats,
});

const mapDispatchToProps = dispatch => ({
  getSessions: () => dispatch(analyticsBusinessActions.getSessions()),
  getSessionsByDevice: () => dispatch(analyticsBusinessActions.getSessionsByDevice()),
  getSessionsByCountry: () => dispatch(analyticsBusinessActions.getSessionsByCountry()),
  getUserStats: () => dispatch(analyticsBusinessActions.getUserStats()),
  getUsersGraph: () => dispatch(analyticsBusinessActions.getUsersGraph()),
  getSessionDurationGraph: () => dispatch(analyticsBusinessActions.getSessionDurationGraph()),
  getScreenSupport: () => dispatch(analyticsBusinessActions.getScreenSupport()),
  onChangeRequestedTime: (time, dataSelector) => dispatch(analyticsBusinessActions.onChangeRequestedTime(time, dataSelector)),
  onChangeGraphMode: mode => dispatch(analyticsBusinessActions.onChangeGraphMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessAnalytics);

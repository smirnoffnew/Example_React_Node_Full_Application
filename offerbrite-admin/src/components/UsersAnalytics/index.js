import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Graph, SessionsByDevice, SessionsByCountry } from 'components/Charts';
import { AnalyticsScreenTable } from 'components/Tables';
import styles from './styles.module.scss';

import { actions as analyticsUserActions } from 'reducers/analyticsUser';

class UserAnalytics extends Component {
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
      <div className={styles.UserAnalytics}>
        
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
  graphModes: state.analyticsUser.graphModes,
  selectedGraphMode: state.analyticsUser.selectedGraphMode,
  sessions: state.analyticsUser.sessions,
  usersGraph: state.analyticsUser.usersGraph,
  sessionDurationGraph: state.analyticsUser.sessionDurationGraph,
  sessionsByDevice: state.analyticsUser.sessionsByDevice,
  sessionsByCountry: state.analyticsUser.sessionsByCountry,
  screenSupport: state.analyticsUser.screenSupport,
  userStats: state.analyticsUser.userStats,
});

const mapDispatchToProps = dispatch => ({
  getSessions: () => dispatch(analyticsUserActions.getSessions()),
  getSessionsByDevice: () => dispatch(analyticsUserActions.getSessionsByDevice()),
  getSessionsByCountry: () => dispatch(analyticsUserActions.getSessionsByCountry()),
  getUserStats: () => dispatch(analyticsUserActions.getUserStats()),
  getUsersGraph: () => dispatch(analyticsUserActions.getUsersGraph()),
  getSessionDurationGraph: () => dispatch(analyticsUserActions.getSessionDurationGraph()),
  getScreenSupport: () => dispatch(analyticsUserActions.getScreenSupport()),
  onChangeRequestedTime: (time, dataSelector) => dispatch(analyticsUserActions.onChangeRequestedTime(time, dataSelector)),
  onChangeGraphMode: mode => dispatch(analyticsUserActions.onChangeGraphMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAnalytics);

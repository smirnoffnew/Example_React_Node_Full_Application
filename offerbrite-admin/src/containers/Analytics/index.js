import React, { Component } from 'react';

import PageTitle from 'components/PageTitle';
import TabBar from 'components/UI/TabBar';
import Tab from 'components/UI/Tab';
import UsersAnalytics from 'components/UsersAnalytics';
import BusinessAnalytics from 'components/BusinessAnalytics';

const tabs = {
  _1: 'Users',
  _2: 'Companies',
};

class Analytics extends Component {
  state = {
    activeTab: tabs._1,
  }

  handleTabClick = tab => {
    this.setState({ activeTab: tab });
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div style={{ paddingBottom: 50 }}>
        <PageTitle title="Analytics" />
        <TabBar>
          <Tab
            active={activeTab === tabs._1}
            title={tabs._1}
            onClick={() => this.handleTabClick(tabs._1)}
          />
          <Tab
            active={activeTab === tabs._2}
            title={tabs._2}
            onClick={() => this.handleTabClick(tabs._2)}
          />
        </TabBar>
        {
          activeTab === tabs._1 ?
            <UsersAnalytics /> :
            <BusinessAnalytics />
        }
      </div>
    );
  }
}

export default Analytics;

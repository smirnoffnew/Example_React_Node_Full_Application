import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import { Container, Content, View } from 'native-base';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import * as scale from 'd3-scale';
import AppHeader from '@/components/AppHeader';
import TextContent from '@/components/TextContent';
import Stat from '@/components/Stat';
import styles from './styles';

class StatsDetails extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Statistic" type="withBackButton" />,
  }

  constructor(props) {
    super(props);
    this.offer = this.props.navigation.getParam('offer');
  }

  render() {
    const countDays = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
    if (this.offer.hasOwnProperty('views') && this.offer.views.length > 0) {
      this.offer.views.forEach(view => {
        countDays[view.day] = countDays[view.day] + 1;
      });
    }

    const views = Object.values(countDays);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const CUT_OFF = 20;
    const Labels = ({ x, y, bandwidth, data }) => (
      data.map((value, index) => (
        <Text
          key={index}
          x={x(index) + (bandwidth / 2)}
          y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
          fontSize={12}
          fill={value >= CUT_OFF ? '#fff' : '#000'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {value}
        </Text>
      ))
    );

    return (
      <Container style={styles.container}>
        <Content>
          <TextContent
            bold
            type="regularSmall"
            color="dark"
            style={styles.statTitle}
          >
            Views
          </TextContent>
          <View style={styles.chart}>
            <BarChart
              style={{ flex: 1 }}
              data={views}
              svg={{ fill: '#81aef2' }}
              contentInset={{ top: 25, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
            >
              <Grid direction={Grid.Direction.HORIZONTAL} />
              <Labels />
            </BarChart>
            <XAxis
              style={{ marginBottom: 10 }}
              data={views}
              formatLabel={(value, index) => weekDays[index]}
              contentInset={{ top: 10, bottom: 10 }}
              scale={scale.scaleBand}
              svg={{ fontSize: 12, fill: '#474747' }}
            />
          </View>
          <Stat
            title="Favorites"
            label="Add to favorites"
            count={this.offer.favorites || 0}
          />
          <Stat
            title="Share"
            label="This offer was shared"
            count={this.offer.shared || 0}
          />
        </Content>
      </Container>
    );
  }
}

export default StatsDetails;

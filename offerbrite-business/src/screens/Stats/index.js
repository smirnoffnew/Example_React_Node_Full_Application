import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FlatList } from 'react-native';
import { Container, View } from 'native-base';
import AppHeader from '@/components/AppHeader';
import OfferCardSmall from '@/components/OfferCardSmall';
import TextContent from '@/components/TextContent';
import styles from './styles';

import { selectors as businessOffersSelectors } from '@/reducers/businessOffers';
import { GA_trackScreen } from '@/services/analytics';

class Stats extends Component {
  static navigationOptions = {
    header: (
      <AppHeader
        screenTitle="Statistic"
        type="empty"
      />
    )
  }

  componentDidMount() {
    GA_trackScreen('Stats');
  }

  _handlePress = offer => {
    this.props.navigation.navigate('StatsDetails', { offer });
  }

  _renderOffer = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ maxWidth: 500, alignSelf: 'center' }}>
        <OfferCardSmall
          offer={item}
          onPress={() => this._handlePress(item)}
        />
      </View>
    </View>
  )

  render() {
    const { liveOffers } = this.props;

    const createOffersContent = () => (
      <FlatList
        data={liveOffers}
        renderItem={this._renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
      />
    );

    return (
      <Container>
        {
          liveOffers.length > 0 ?
            createOffersContent() :
            <TextContent
              type="regular"
              color="dark"
              style={styles.instructionsContainer}
            >
              No offers
            </TextContent>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  liveOffers: businessOffersSelectors.liveOffers(state),
});

Stats.propTypes = {
  liveOffers: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Stats);

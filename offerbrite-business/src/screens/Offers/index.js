import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, View } from 'native-base';
import { RefreshControl, FlatList } from 'react-native';
import AppHeader from '@/components/AppHeader';
import Segment from '@/components/UI/Segment';
import OfferCard from '@/components/OfferCard';
import TextContent from '@/components/TextContent';
import styles from './styles';
import appTheme from '@/theme';

import toCapitalize from '@/services/helpers/toCapitalize';
import { actions as businessOffersActions, selectors as businessOffersSelectors } from '@/reducers/businessOffers';
import { actions as offerActions } from '@/reducers/offer';
import { GA_trackScreen } from '@/services/analytics';

class Offers extends Component {
  static navigationOptions = {
    header: (
      <AppHeader
        screenTitle="Offers"
        type="full"
      />
    )
  }

  state = {
    active: 'left',
    refreshing: false,
  }

  componentDidMount() {
    GA_trackScreen('Offers');
    this.props.getOffers();
    this.props.getPastOffers();
  }

  _onToggleHandler = id => {
    if (id !== this.state.active) {
      this.setState(prevState => ({
        active: prevState.active === 'left' ? 'right' : 'left',
      }));
    }
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.props.onRefresh();
      const fetchData = new Promise(resolve => {
        resolve(this.props.getOffers());
      });
      fetchData.then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  _onEditPressHandler = offer => {
    this.props.navigation.navigate('OfferManagement', {
      action: 'edit',
      offer,
    });
    this.props.setOfferToEdit(offer);
  }

  _onPreviewPressHandler = offer => {
    const tags = [toCapitalize(offer.category)];
    let locationTag;

    offer.locations.forEach(location => {
      let { city, state, region, country } = location.address;
      locationTag = city || state || region || country;
      tags.push(locationTag);
    });

    this.props.navigation.navigate('OfferPreview', {
      offer: {
        ...offer,
        tags,
        past: this.state.active === 'right' ? true : false,
      }
    });
  }

  _onCreatePressHandler = () => {
    this.props.navigation.navigate('OfferManagement', { action: 'create' });
  }

  _renderOffer = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ maxWidth: 500 }}>
        <OfferCard
          past={this.state.active === 'right' ? true : false}
          offer={item}
          onEdit={() => this._onEditPressHandler(item)}
          onPreview={() => this._onPreviewPressHandler(item)}
        />
      </View>
    </View>
  )

  _fetchMoreData = () => {
    const { liveOffers, queryParams, getOffers } = this.props;
    console.log(queryParams.skip - liveOffers.length === queryParams.limit);
    if (queryParams.skip - liveOffers.length === 0) {
      getOffers();
    }
  }

  render() {
    const { active, refreshing } = this.state;
    const offers = active === 'left' ? this.props.liveOffers : this.props.pastOffers;

    const createOffersContent = () => (
      <FlatList
        data={offers}
        renderItem={this._renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[appTheme.primary]}
            tintColor={appTheme.primary}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
          />
        }
        onEndReached={this._fetchMoreData}
        onEndReachedThreshold={0.5}
      />
    );

    return (
      <Container>
        <View style={styles.segmentContainer}>
          <View style={styles.segment}>
            <Segment
              onPress={this._onToggleHandler}
              active={active}
              titleLeft="Live"
              titleRight="Past"
              rippleActive={appTheme.primaryLight}
              rippleDefault={appTheme.primaryLight}
            />
          </View>
        </View>
        {
          offers.length > 0 ?
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
  pastOffers: businessOffersSelectors.pastOffers(state),
  queryParams: businessOffersSelectors.queryParams(state),
});

const mapDispatchToProps = dispatch => ({
  getOffers: (limit, skip) => dispatch(businessOffersActions.getOffers(limit, skip)),
  getPastOffers: () => dispatch(businessOffersActions.getPastOffers()),
  setOfferToEdit: offer => dispatch(offerActions.setOfferToEdit(offer)),
  onRefresh: () => dispatch(businessOffersActions.onRefresh()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Offers);

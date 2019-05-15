import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import { FlatList, RefreshControl } from 'react-native';
import LocationSelect from '@/components/LocationBar/LocationSelect';
import OfferCard from '@/components/OfferCard';
import TextContent from '@/components/TextContent';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import ContainerCenter from '@/components/UI/ContainerCenter';
import styles from './styles';
import appTheme from '@/theme';

import { addFavoriteProperty } from '@/services/helpers/formatData';
import requestLocationPermission from '@/services/helpers/geolocation';
import { actions as locationActions, selectors as locationSelectors } from '@/reducers/location';
import { actions as searchActions, selectors as searchSelectors } from '@/reducers/search';
import { actions as favoritesActions, selectors as favoritesSelectors } from '@/reducers/favorites';
import { GA_trackScreen } from '@/services/analytics';
import { statisticsAddView } from '@/services/api';
import { checkNotificationsPermissions } from '@/services/pushNotifications';

class Home extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    refreshing: false,
    limit: 20,
    skip: 0,
  }

  async componentDidMount() {
    await GA_trackScreen('Home');
    await requestLocationPermission();
    await checkNotificationsPermissions();
    await this.props.getUserLocation();
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.props.onRefreshByLocation();
      const fetchData = new Promise(resolve => {
        resolve(this.props.getOffersByUserLocation(null));
      });
      fetchData.then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  _renderOffer = ({ item }) => (
    <View style={styles.itemContainer}>
      <ContainerCenter>
        <OfferCard
          offer={item}
          onPreview={() => this._onPreview(item.id, item.locations)}
          addToFavorites={() => this.props.postFavoriteOffer(item)}
          removeFromFavorites={() => this.props.deleteFavoriteOffer(item)}
          onReport={() => this._handleReport(item.id)}
        />
      </ContainerCenter>
    </View>
  )

  _fetchMoreData = () => {
    const { paramsByLocation, localOffers, getOffersByUserLocation } = this.props;
    if (paramsByLocation.skip - localOffers.length === 0) {
      getOffersByUserLocation(null);
    }
  }

  _onPreview = (offerId, location) => {
    statisticsAddView(offerId);
    this.props.navigation.navigate('OfferPreview', { backRoute: 'Home' });
    this.props.getOfferById(offerId, location);
  }

  _handleReport = offerId => {
    this.props.navigation.navigate('Report', { offerId });
  }

  render() {
    const {
      localOffers,
      userLocation,
      setUserLocation,
      editUserAddress,
      eraseLocation,
      favoriteOffers,
    } = this.props;

    let offers = localOffers;

    if (favoriteOffers.length > 0 && localOffers.length > 0) {
      offers = addFavoriteProperty(localOffers, favoriteOffers);
    }

    const createOffersContent = () => (
      <FlatList
        data={offers}
        renderItem={this._renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[appTheme.danger]}
            tintColor={appTheme.danger}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        onEndReached={this._fetchMoreData}
        onEndReachedThreshold={0.5}
      />
    );

    return (
      <Container style={styles.container}>
        <StatusBarAndroid />
        <View style={styles.locationInputContainer}>
          <LocationSelect
            header
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            editUserAddress={editUserAddress}
            eraseLocation={eraseLocation}
          />
        </View>
        {
          offers.length > 0 ?
            <View>
              {createOffersContent()}
            </View> :
            <TextContent
              type="regular"
              color="dark"
              style={styles.textContainer}
              center
            >
              There are no offers for your current location
            </TextContent>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  localOffers: searchSelectors.localOffers(state),
  userLocation: locationSelectors.userLocation(state),
  favoriteOffers: favoritesSelectors.favoriteOffers(state),
  paramsByLocation: searchSelectors.paramsByLocation(state),
});

const mapDispatchToProps = dispatch => ({
  getUserLocation: () => dispatch(locationActions.getUserLocation()),
  setUserLocation: locationData => dispatch(locationActions.setUserLocation(locationData)),
  editUserAddress: text => dispatch(locationActions.editUserAddress(text)),
  eraseLocation: () => dispatch(locationActions.eraseLocation()),
  getOfferById: (offerId, location) => dispatch(searchActions.getOfferById(offerId, location)),
  getOffersByUserLocation: location => dispatch(searchActions.getOffersByUserLocation(location)),
  onRefreshByLocation: () => dispatch(searchActions.onRefreshByLocation()),
  postFavoriteOffer: offer => dispatch(favoritesActions.postFavoriteOffer(offer)),
  deleteFavoriteOffer: offer => dispatch(favoritesActions.deleteFavoriteOffer(offer)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

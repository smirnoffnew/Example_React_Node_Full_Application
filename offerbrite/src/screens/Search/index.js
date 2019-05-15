import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import { Container, Content, View } from 'native-base';
import { FlatList } from 'react-native';
import SearchBar from '@/components/SearchBar';
import LocationSelect from '@/components/LocationBar/LocationSelect';
import DropDown from '@/components/UI/DropDown';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import OfferCardSmall from '@/components/OfferCardSmall';
import styles from './styles';

import { addFavoriteProperty } from '@/services/helpers/formatData';
import { actions as searchActions, selectors as searchSelectors } from '@/reducers/search';
import { actions as favoritesActions, selectors as favoritesSelectors } from '@/reducers/favorites';
import { GA_trackScreen } from '@/services/analytics';
import { debounce } from 'lodash';
import { statisticsAddView } from '@/services/api';

class Search extends Component {
  static navigationOptions = {
    header: <SearchBar header />
  }

  componentDidMount() {
    GA_trackScreen('Search');
    this.props.getCategories();
  }

  _onPreviewPressHandler = (offerId, location) => {
    statisticsAddView(offerId);
    this.props.navigation.navigate('OfferPreview', { backRoute: 'Search' });
    this.props.getOfferById(offerId, location);
  }

  _renderOffer = ({ item }) => (
    <View style={styles.itemContainer}>
      <OfferCardSmall
        offer={item}
        onPreview={() => this._onPreviewPressHandler(item.id, item.locations)}
        removeFromFavorites={() => this.props.deleteFavoriteOffer(item)}
        addToFavorites={() => this.props.postFavoriteOffer(item)}
      />
    </View>
  )

  _fetchMoreData = () => {
    const { paramsBySearch, results, getOffers } = this.props;
    if (paramsBySearch.skip - results.length === 0) {
      getOffers();
    }
  }

  render() {
    const {
      categories,
      selectedCategory,
      searchLocation,
      results,
      setCategory,
      setSearchLocation,
      editSearchAddress,
      eraseSearchLocation,
      favoriteOffers,
    } = this.props;

    let offers = results;

    if (offers.length > 0 && favoriteOffers.length > 0) {
      offers = addFavoriteProperty(results, favoriteOffers);
    }

    const createOffersContent = () => (
      <FlatList
        data={offers}
        renderItem={this._renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        onEndReached={debounce(this._fetchMoreData, 500)}
        onEndReachedThreshold={0.5}
      />
    );

    return (
      <Container onStartShouldSetResponderCapture={() => {
        this.setState({ enableScrollViewScroll: true });
      }}>
        <StatusBarAndroid />
        <Content>
          <LocationSelect
            userLocation={searchLocation}
            setUserLocation={setSearchLocation}
            editUserAddress={editSearchAddress}
            eraseLocation={eraseSearchLocation}
          />
          <View style={{ margin: 5 }} />
          <DropDown
            items={categories}
            selectedItem={selectedCategory}
            onChangeItem={setCategory}
          />
          {
            offers.length > 0 ?
              <View>
                {createOffersContent()}
              </View> :
              null
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  categories: searchSelectors.categories(state),
  selectedCategory: searchSelectors.selectedCategory(state),
  searchLocation: searchSelectors.searchLocation(state),
  results: searchSelectors.results(state),
  favoriteOffers: favoritesSelectors.favoriteOffers(state),
  paramsBySearch: searchSelectors.paramsBySearch(state),
});

const mapDispatchToProps = dispatch => ({
  getOffers: () => dispatch(searchActions.getOffers()),
  getCategories: () => dispatch(searchActions.getCategories()),
  setCategory: value => dispatch(searchActions.setCategory(value)),
  getOfferById: (offerId, location) => dispatch(searchActions.getOfferById(offerId, location)),
  setSearchLocation: locationData => dispatch(searchActions.setSearchLocation(locationData)),
  editSearchAddress: text => dispatch(searchActions.editSearchAddress(text)),
  eraseSearchLocation: () => dispatch(searchActions.eraseSearchLocation()),
  postFavoriteOffer: offer => dispatch(favoritesActions.postFavoriteOffer(offer)),
  deleteFavoriteOffer: offer => dispatch(favoritesActions.deleteFavoriteOffer(offer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);

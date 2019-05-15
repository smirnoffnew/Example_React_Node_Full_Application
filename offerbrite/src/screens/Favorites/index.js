import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import { FlatList } from 'react-native';
import AppHeader from '@/components/AppHeader';
import OfferCardSmall from '@/components/OfferCardSmall';
import TextContent from '@/components/TextContent';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import styles from './styles';

import { actions as searchActions } from '@/reducers/search';
import { actions as favoritesActions, selectors as favoritesSelectors } from '@/reducers/favorites';
import { GA_trackScreen } from '@/services/analytics';
import { statisticsAddView } from '@/services/api';

class Favorites extends Component {
  static navigationOptions = {
    header: <AppHeader header screenTitle="Favorites" type="empty" />,
  }

  componentDidMount() {
    GA_trackScreen('Favorites');
    this.props.getFavoriteOffers();
  }

  _onPreviewPressHandler = (offerId, location) => {
    statisticsAddView(offerId);
    this.props.navigation.navigate('OfferPreview', { backRoute: 'Favorites' });
    this.props.getOfferById(offerId, location);
  }

  _renderOffer = ({ item }) => (
    <OfferCardSmall
      offer={{ ...item, favorite: true }}
      onPreview={() => this._onPreviewPressHandler(item.id, item.locations)}
      removeFromFavorites={() => this.props.deleteFavoriteOffer(item)}
      addToFavorites={() => this.props.postFavoriteOffer(item)}
    />
  )

  render() {
    const { favoriteOffers } = this.props;

    const createOffersContent = () => (
      <FlatList
        data={favoriteOffers}
        renderItem={this._renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
      />
    );

    return (
      <Container>
        <StatusBarAndroid />
        {
          favoriteOffers.length > 0 ?
            createOffersContent() :
            <TextContent
              type="regular"
              color="dark"
              style={{
                width: '60%',
                margin: '20%',
                alignItems: 'center',
              }}
              center
            >
              You haven't selected favorite offers yet
              </TextContent>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  favoriteOffers: favoritesSelectors.favoriteOffers(state),
});

const mapDispatchToProps = dispatch => ({
  getFavoriteOffers: () => dispatch(favoritesActions.getFavoriteOffers()),
  postFavoriteOffer: offer => dispatch(favoritesActions.postFavoriteOffer(offer)),
  deleteFavoriteOffer: offer => dispatch(favoritesActions.deleteFavoriteOffer(offer)),
  getOfferById: (offerId, location) => dispatch(searchActions.getOfferById(offerId, location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);

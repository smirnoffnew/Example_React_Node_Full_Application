import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import call from 'react-native-phone-call';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TouchableOpacity, Linking, BackHandler } from 'react-native';
import { Container, Content, View, Text, Thumbnail, Icon } from 'native-base';
import ContainerCenter from '@/components/UI/ContainerCenter';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import AppHeader from '@/components/AppHeader';
import ButtonContainer from '@/components/UI/ButtonContainer';
import PriceInfo from '@/components/PriceInfo';
import TextContent from '@/components/TextContent';
import Maps from '@/components/Maps';
import Address from '@/components/UI/Address';
import Tag from '@/components/Tag';
import styles from './styles';

import { convertAddressDataToString } from '@/services/helpers/geolocation';
import { findDuration } from '@/services/helpers/formatDate';
import throwNotification from '@/services/helpers/notification';
import { selectors as searchSelectors, actions as searchActions } from '@/reducers/search';
import { actions as favoritesActions, selectors as favoritesSelectors } from '@/reducers/favorites';

class OfferPreview extends Component {
  static navigationOptions = ({ navigation }) => {
    const { backRoute } = navigation.state.params;
    return {
      header: null,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { navigation } = this.props;
      const { backRoute } = navigation.state.params;
      navigation.navigate(backRoute);
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate(prevProps) {
    const { favoriteOffers, getOfferById, selectedOffer } = this.props;

    if (favoriteOffers.length !== prevProps.favoriteOffers.length) {
      getOfferById(selectedOffer.id, selectedOffer.locations);
    }
  }

  _handleLocationPress = location => {
    this.props.setChosenOfferLocation(location);
    this.props.navigation.navigate('MapScreen');
  }

  _handleTagPress = tag => {
    this.props.resetSearchResults();
    this.props.getOffers(tag);
    this.props.navigation.navigate('Search');
  }

  _handleReport = offerId => {
    this.props.navigation.navigate('Report', { offerId });
  }

  _handleCall = number => {
    const args = {
      number,
      prompt: true,
    };

    call(args).catch(() => throwNotification('Something went wrong'));
  }

  _handleLinkPress = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          throwNotification(`Can\'t open url: ${url}`);
        }
      });
  }

  render() {
    const { selectedOffer, postFavoriteOffer, deleteFavoriteOffer, navigation } = this.props;
    const statusBarHeight = getStatusBarHeight(true);

    const createOfferTitle = offerTitle => (
      <TextContent
        style={{ marginTop: 10 }}
        type="regular"
        color="dark"
        bold
      >
        {offerTitle}
      </TextContent>
    );

    const createAddresses = locations => (
      locations.map((place, index) => (
        <TextContent type="subtext" key={index} color="darkGray">
          {`- ${convertAddressDataToString(place.address)}`}
        </TextContent>
      ))
    );

    const createTags = tags => (
      <View style={styles.tagsContainer}>
        {
          tags.map((tag, index) => (
            <Tag
              key={index}
              onPress={() => this._handleTagPress(tag)}
              tag={tag.value}
            />
          ))
        }
      </View>
    );

    const createEndDate = (isHidden, startDate, endDate) => !isHidden ?
      <View style={styles.endDateContainer}>
        <Icon
          name="md-time"
          style={styles.icon}
        />
        <View style={styles.endDateTextContainer}>
          <TextContent type="subtext" color="default">End of promotion</TextContent>
          <TextContent type="subtext" color="danger">
            {findDuration(startDate, endDate)}
          </TextContent>
        </View>
      </View> :
      null;

    const createSectionTitle = title => (
      <TextContent
        type="subtext"
        color="darkGray"
        style={styles.sectionTitleContainer}
      >
        {title}
      </TextContent>
    );

    const createDescription = () => {
      const hasDescription = selectedOffer.hasOwnProperty('description') && selectedOffer.description !== '';

      return hasDescription ?
        <Fragment>
          {createSectionTitle('Description')}
          <TextContent
            style={styles.descriptionContainer}
            type="subtext"
            color="default"
          >
            {selectedOffer.description}
          </TextContent>
        </Fragment> :
        null;
    };

    const createPhoneNumbers = numbers => {
      return numbers.map((mobileNumber, index) => {
        const number = `+${mobileNumber.cc}${mobileNumber.number}`;
        return (
          <TouchableOpacity
            key={index}
            style={{ paddingVertical: 5 }}
            onPress={() => this._handleCall(number)}
          >
            <Text style={styles.textUnderlined}>
              {number}
            </Text>
          </TouchableOpacity>
        );
      });
    };

    const createLink = link => (
      <TouchableOpacity
        style={{ paddingVertical: 5 }}
        onPress={() => this._handleLinkPress(link)}
      >
        <Text style={styles.textUnderlined}>
          {link}
        </Text>
      </TouchableOpacity>
    );

    const createMap = locations => (
      <Fragment>
        {createSectionTitle('Map')}
        <View style={styles.mapContainer}>
          <Maps coords={locations[0].position} />
          <View style={styles.locationContainer}>
            {
              locations.map((place, index) => (
                <View
                  key={index}
                  style={styles.location}
                >
                  <Address
                    location={place}
                    onPress={() => this._handleLocationPress(place)}
                  />
                </View>
              ))
            }
          </View>
        </View>
      </Fragment>
    );

    return (
      <Container>
        <StatusBarAndroid />
        <AppHeader
          screenTitle=" "
          backRoute={navigation.state.params.backRoute}
          componentRight={
            selectedOffer &&
            <ButtonContainer
              header
              withShare
              withReport
              onReport={() => this._handleReport(selectedOffer.id)}
              onAddFavorite={() => postFavoriteOffer(selectedOffer)}
              onRemoveFavorite={() => deleteFavoriteOffer(selectedOffer)}
              offer={selectedOffer}
            />
          }
        />
        {selectedOffer &&
          <Content contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
            <ContainerCenter style={{ backgroundColor: '#fff' }}>
              <View style={[
                styles.imageContainer,
                { paddingTop: statusBarHeight }
              ]}>
                <Thumbnail
                  square
                  style={styles.image}
                  source={{ uri: selectedOffer.imagesUrls[0] }}
                />
              </View>
              <View style={styles.priceContainer}>
                <PriceInfo
                  offer={selectedOffer}
                  discountStyle={{ borderRadius: 5 }}
                />
              </View>
              <View style={styles.content}>
                {createOfferTitle(selectedOffer.title)}
                {createAddresses(selectedOffer.locations)}
                {createEndDate(selectedOffer.isDateHidden, selectedOffer.startDate, selectedOffer.endDate)}
                {createTags(selectedOffer.tags)}
              </View>
              {createDescription()}
              {createSectionTitle('Our contacts')}
              <View style={styles.contactsContainer}>
                <View style={styles.logoContainer}>
                  <Thumbnail
                    source={
                      selectedOffer.business.logoUrl ?
                        { uri: selectedOffer.business.logoUrl } :
                        require('../../../assets/images/logo-red.png')
                    }
                    style={styles.logo}
                  />
                </View>
                <TextContent type="regular" color="dark">{selectedOffer.business.brandName}</TextContent>
                {
                  selectedOffer.business.isVerified ?
                    <View style={[styles.badgeContainer, styles.badgeVerified]}>
                      <Icon name="md-checkmark" style={styles.badgeIcon} />
                      <Text style={styles.badgeTextVerified}>Verified</Text>
                    </View> :
                    <View style={[styles.badgeContainer, styles.badgeUnverified]}>
                      <Text style={styles.badgeTextUnverified}>Unverified</Text>
                    </View>
                }
                {selectedOffer.business.websiteUrl && createLink(selectedOffer.business.websiteUrl)}
                {createPhoneNumbers(selectedOffer.business.mobileNumbers)}
              </View>
              {createMap(selectedOffer.locations)}
            </ContainerCenter>
          </Content>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  selectedOffer: searchSelectors.selectedOffer(state),
  favoriteOffers: favoritesSelectors.favoriteOffers(state),
});

const mapDispatchToProps = dispatch => ({
  postFavoriteOffer: offer => dispatch(favoritesActions.postFavoriteOffer(offer)),
  deleteFavoriteOffer: offer => dispatch(favoritesActions.deleteFavoriteOffer(offer)),
  getOfferById: (offerId, location) => dispatch(searchActions.getOfferById(offerId, location)),
  setChosenOfferLocation: location => dispatch(searchActions.setChosenOfferLocation(location)),
  getOffers: tag => dispatch(searchActions.getOffers(tag)),
  resetSearchResults: () => dispatch(searchActions.resetSearchResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferPreview);

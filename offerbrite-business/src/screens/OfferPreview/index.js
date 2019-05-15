import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Container, Content, View, Text, Thumbnail, Icon, Button } from 'native-base';
import AppHeader from '@/components/AppHeader';
import TextContent from '@/components/TextContent';
import ContainerCenter from '@/components/UI/ContainerCenter';
import styles from './styles';

import getPriceWithDiscount from '@/services/helpers/getPriceWithDiscount';
import { convertAddressDataToString } from '@/services/helpers/geolocation';
import { findDuration } from '@/services/helpers/formatDate';
import { actions as offerActions } from '@/reducers/offer';
import { GA_trackScreen } from '@/services/analytics';

class OfferPreview extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Preview" type="withBackButton" />
  }

  constructor(props) {
    super(props);
    this.offer = this.props.navigation.getParam('offer');
  }

  componentDidMount() {
    GA_trackScreen('Offer Preview');
  }

  _onEditPressHandler = offer => {
    this.props.navigation.navigate('OfferManagement', {
      action: 'edit',
      offer,
    });
    this.props.setOfferToEdit(offer);
  }

  render() {
    return (
      <Container style={styles.container}>
        {this.offer &&
          <Content contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
            <ContainerCenter style={{ backgroundColor: '#fff' }}>
              <View style={styles.imageContainer}>
                <Thumbnail
                  square
                  style={
                    this.offer.imagesUrls[0] ?
                      { width: null, flex: 1, resizeMode: 'cover' } :
                      { width: '30%', height: '30%', resizeMode: 'contain', marginTop: 100, marginLeft: '35%' }
                  }
                  source={
                    this.offer.imagesUrls[0] ?
                      { uri: this.offer.imagesUrls[0] } :
                      require('../../../assets/images/camera.png')
                  }
                />
              </View>
              {
                this.offer.hasOwnProperty('fullPrice') &&
                this.offer.hasOwnProperty('discount') &&
                this.offer.fullPrice > 0 &&
                this.offer.discount > 0 &&
                <View style={styles.priceContainer}>
                  <View style={styles.discount}>
                    <Text style={styles.discountText}>{`-${this.offer.discount}%`}</Text>
                  </View>
                  <View style={styles.discountContainer}>
                    <View style={styles.fullPrice}>
                      <Text style={styles.fullPriceText}>{`$${this.offer.fullPrice}`}</Text>
                    </View>
                    <View style={styles.newPrice}>
                      <Text style={styles.newPriceText}>
                        {`$${getPriceWithDiscount(this.offer.fullPrice, this.offer.discount)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              }
              <View style={styles.content}>
                <TextContent
                  style={{ marginTop: 10 }}
                  type="regular"
                  color="dark"
                  bold
                >
                  {this.offer.title}
                </TextContent>
                {
                  this.offer.locations.map((place, index) => (
                    <TextContent type="subtext" color="darkGray" key={index}>
                      {convertAddressDataToString(place.address)}
                    </TextContent>
                  ))
                }
                <View style={styles.endDateContainer}>
                  <Icon
                    name="md-time"
                    style={styles.icon}
                  />
                  <View style={styles.endDateTextContainer}>
                    {
                      !this.offer.past ?
                        <Fragment>
                          <TextContent type="subtext" color="dark">End of promotion</TextContent>
                          <TextContent type="subtext" color="danger">
                            {findDuration(this.offer.endDate)}
                          </TextContent>
                        </Fragment> :
                        <TextContent type="subtext" color="primary">The offer is over</TextContent>
                    }
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {
                    this.offer.tags.map((tag, index) => (
                      <TextContent
                        key={index}
                        type="subtext"
                        color="default"
                        style={styles.tag}
                      >
                        {tag}
                      </TextContent>
                    ))
                  }
                </View>
              </View>
              {this.offer.hasOwnProperty('description') && this.offer.description !== '' &&
                <Fragment>
                  <View style={styles.sectionTitleContainer}>
                    <TextContent type="subtext" color="darkGray">Description</TextContent>
                  </View>
                  <TextContent style={styles.descriptionContainer} color="default" type="subtext">
                    {this.offer.description}
                  </TextContent>
                </Fragment>
              }
              <View style={styles.sectionTitleContainer}>
                <TextContent type="subtext" color="darkGray">Our contacts</TextContent>
              </View>
              <View style={styles.contactsContainer}>
                <View style={styles.logoContainer}>
                  <Thumbnail
                    source={
                      this.offer.business.logoUrl ?
                        { uri: this.offer.business.logoUrl } :
                        require('../../../assets/images/logo-blue.png')
                    }
                    style={styles.logo}
                  />
                </View>
                <TextContent type="regular" color="dark">{this.offer.business.brandName}</TextContent>
                {
                  this.offer.business.isVerified ?
                    <View style={[styles.badgeContainer, styles.badgeVerified]}>
                      <Icon name="md-checkmark" style={styles.badgeIcon} />
                      <Text style={styles.badgeTextVerified}>Verified</Text>
                    </View> :
                    <View style={[styles.badgeContainer, styles.badgeUnverified]}>
                      <Text style={styles.badgeTextUnverified}>Unverified</Text>
                    </View>
                }
                {this.offer.business.websiteUrl &&
                  <Text style={styles.textUnderlined}>{this.offer.business.websiteUrl}</Text>
                }
                {
                  this.offer.business.mobileNumbers.map((mobileNumber, index) => (
                    <Text style={styles.textUnderlined} key={index}>
                      {`+${mobileNumber.cc}${mobileNumber.number}`}
                    </Text>
                  ))
                }
              </View>
            </ContainerCenter>
          </Content>
        }
      </Container>
    );
  }
}

OfferPreview.propTypes = {
  setOfferToEdit: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  setOfferToEdit: offer => dispatch(offerActions.setOfferToEdit(offer)),
});

export default connect(null, mapDispatchToProps)(OfferPreview);

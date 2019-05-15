import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Card, CardItem, Thumbnail, Text, Icon, View } from 'native-base';
import TextContent from '@/components/TextContent';
import ButtonSquare from '@/components/UI/ButtonSquare';
import styles from './styles';

import { findDuration } from '@/services/helpers/formatDate';
import { convertAddressDataToString } from '@/services/helpers/geolocation';
import getPriceWithDiscount from '@/services/helpers/getPriceWithDiscount';

class OfferCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      endsAt: findDuration(this.props.offer.endDate),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.updateEndsAt();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateEndsAt = () => {
    this.setState({ endsAt: findDuration(this.props.offer.endDate) });
  }

  render() {
    const { offer, onEdit, onPreview, past } = this.props;
    const imageUrl = offer.imagesUrls[0];
    const addresses = offer.locations.map(place => convertAddressDataToString(place.address));

    return (
      <Card>
        <CardItem cardBody>
          <View style={styles.cardHeader}>
            <View style={styles.imageContainer}>
              <Thumbnail
                source={{ uri: imageUrl }}
                style={styles.image}
                square
              />
            </View>
            <View style={styles.titleContainer}>
              <TextContent type="regularSmall" color="dark" bold>{offer.title}</TextContent>
              <TextContent
                style={{ marginVertical: 10 }}
                type="small"
                color="darkGray"
              >
                {addresses[0]}
              </TextContent>
              {
                addresses.length > 1 &&
                <TextContent type="small" color="default">
                  {`+ ${addresses.length - 1 > 1 ? `${addresses.length - 1} addresses` : '1 address'}`}
                </TextContent>
              }
              {
                offer.hasOwnProperty('fullPrice') &&
                offer.hasOwnProperty('discount') &&
                offer.fullPrice > 0 &&
                offer.discount > 0 &&
                <View style={styles.priceContainer}>
                  <View style={[styles.discount, !past ? styles.discountLive : styles.discountPast]}>
                    <Text style={styles.discountText}>{`-${offer.discount}%`}</Text>
                  </View>
                  <View style={styles.discountContainer}>
                    <View style={styles.fullPrice}>
                      <Text style={styles.fullPriceText}>{`$${offer.fullPrice.toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.newPrice}>
                      <Text style={!past ? styles.newPriceTextLive : styles.newPriceTextPast}>
                        {`$${getPriceWithDiscount(offer.fullPrice, offer.discount)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              }
            </View>
          </View>
        </CardItem>
        <CardItem>
          <View style={styles.endDateContainer}>
            <Icon
              name="md-time"
              style={styles.icon}
            />
            {
              !past ?
                <View style={styles.endDateTextContainer}>
                  <TextContent color="dark" type="small">End of promotion</TextContent>
                  <TextContent color="primary" type="small">{this.state.endsAt}</TextContent>
                </View> :
                <TextContent color="primary" type="small">The offer is over</TextContent>
            }
          </View>
        </CardItem>
        <CardItem>
          <View style={styles.buttonContainer}>
            {
              !past ?
                <Fragment>
                  <View style={styles.buttonColumn}>
                    <ButtonSquare
                      onPress={onPreview}
                      light
                      smallHeight
                    >
                      View
                    </ButtonSquare>
                  </View>
                  <View style={styles.buttonColumn}>
                    <ButtonSquare
                      primary
                      onPress={onEdit}
                      smallHeight
                      iconName="md-create"
                    >
                      Edit offer
                    </ButtonSquare>
                  </View>
                </Fragment> :
                <View style={styles.buttonRow}>
                  <ButtonSquare
                    gray
                    onPress={onPreview}
                    smallHeight
                  >
                    View
                  </ButtonSquare>
                </View>
            }
          </View>
        </CardItem>
      </Card>
    );
  }
}

OfferCard.propTypes = {
  offer: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  past: PropTypes.bool,
};

export default OfferCard;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Card, Thumbnail, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import TextContent from '@/components/TextContent';
import PriceInfo from '@/components/PriceInfo';
import ButtonContainer from '@/components/UI/ButtonContainer';
import styles from './styles';

import { convertAddressDataToString } from '@/services/helpers/geolocation';
import toCapitalize from '@/services/helpers/toCapitalize';

export default function OfferCardSmall({ offer, onPreview, addToFavorites, removeFromFavorites }) {
  let expiredBadge = null;
  let handlePress = onPreview;
  let activeOpacity = 0.5;

  if (offer.hasOwnProperty('past') && offer.past) {
    expiredBadge = (
      <View style={styles.expiredBadgeContainer}>
        <Text style={styles.expiredBadgeText}>EXPIRED</Text>
        <Text style={styles.expiredBadgeText}>OFFER</Text>
      </View>
    );
    handlePress = () => { };
    activeOpacity = 1;
  }

  return (
    <Card>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.offerContainer}
        activeOpacity={activeOpacity}
      >
        <View style={styles.imageContainer}>
          <Thumbnail
            style={styles.image}
            square
            source={{ uri: offer.imagesUrls[0] }}
          />
          {expiredBadge}
          <ButtonContainer
            onAddFavorite={addToFavorites}
            onRemoveFavorite={removeFromFavorites}
            offer={offer}
            wrapperStyle={styles.buttonContainer}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextContent
            type="regular"
            color="dark"
            bold
          >
            {offer.title}
          </TextContent>
          {
            offer.locations.length > 0 ?
              <Fragment>
                <TextContent type="subtext" color="darkGray">
                  {convertAddressDataToString(offer.locations[0].address)}
                </TextContent>
                {
                  offer.locations.length > 1 ?
                    <TextContent type="subtext" color="darkGray">
                      {`+ ${offer.locations.length - 1} additional location${offer.locations.length - 1 > 1 ? 's' : ''}`}
                    </TextContent> :
                    null
                }
              </Fragment> :
              <TextContent type="subtext" color="darkGray">
                {`Category: ${toCapitalize(offer.category)}`}
              </TextContent>
          }
          <PriceInfo offer={offer} />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

OfferCardSmall.propTypes = {
  offer: PropTypes.object.isRequired,
  onPreview: PropTypes.func.isRequired,
  addToFavorites: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

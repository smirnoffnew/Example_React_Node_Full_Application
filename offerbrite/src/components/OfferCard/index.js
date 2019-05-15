import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Thumbnail, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import TextContent from '@/components/TextContent';
import PriceInfo from '@/components/PriceInfo';
import ButtonContainer from '@/components/UI/ButtonContainer';
import styles from './styles';

import { convertAddressDataToString } from '@/services/helpers/geolocation';
import getPriceWithDiscount from '@/services/helpers/getPriceWithDiscount';

export default function OfferCard({ offer, onPreview, removeFromFavorites, addToFavorites, onReport }) {
  const imageUrl = offer.imagesUrls[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ borderRadius: 5, overflow: 'hidden' }} onPress={onPreview} activeOpacity={0.7}>
        <View style={styles.imageContainer}>
          <Thumbnail
            source={{ uri: imageUrl }}
            style={styles.image}
            square
          />
          <ButtonContainer
            withShare
            onAddFavorite={addToFavorites}
            onRemoveFavorite={removeFromFavorites}
            offer={offer}
            wrapperStyle={styles.buttonsContainer}
          />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleContainer}>
            <TextContent
              style={{ marginBottom: 10 }}
              type="regular"
              color="dark"
              bold
            >
              {offer.title}
            </TextContent>
            {
              offer.locations.map((location, index) => (
                <TextContent style={{ marginBottom: 10 }} type="subtext" key={index} color="darkGray">
                  {convertAddressDataToString(location.address)}
                </TextContent>
              ))
            }
          </View>
          <PriceInfo
            offer={offer}
            discountStyle={{ borderTopRightRadius: 5 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// OfferCard.defaultProps = {
//   offer: {
//     title: 'SPA day at the Grand Admiral Resort',
//     imageUrl: 'https://www.ndtv.com/cooks/images/grilled-minty-chicken-new.jpg?downsize=650:400&output-quality=70&output-format=webp',
//     startDate: '2018-09-20T14:19:02.725Z',
//     endDate: '2018-09-29T15:21:02.725Z',
//     address: '234 Some Street, some City, some Country',
//   },
// };

OfferCard.propTypes = {
  offer: PropTypes.object,
  onPreview: PropTypes.func.isRequired,
};

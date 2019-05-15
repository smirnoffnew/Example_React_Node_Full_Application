import React from 'react';
import PropTypes from 'prop-types';

import { Card, Thumbnail, View } from 'native-base';
import TextContent from '@/components/TextContent';
import ButtonSquare from '@/components/UI/ButtonSquare';
import styles from './styles';

export default function OfferCardSmall({ offer, onPress }) {
  return (
    <Card style={{ width: '100%' }}>
      <View style={styles.offerContainer}>
        <View style={styles.imageContainer}>
          <Thumbnail
            style={styles.image}
            square
            source={{ uri: offer.imagesUrls[0] }}
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
          <ButtonSquare
            primary
            onPress={onPress}
            smallHeight
          >
            View statistic
          </ButtonSquare>
        </View>
      </View>
    </Card>
  );
}

OfferCardSmall.propTypes = {
  offer: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'native-base';
import styles from './styles';

import getPriceWithDiscount from '@/services/helpers/getPriceWithDiscount';

export default function PriceInfo({ offer, discountStyle }) {
  const hasDiscount = () => {
    return offer.hasOwnProperty('discount') && offer.discount > 0;
  };

  const hasPrice = () => {
    return offer.hasOwnProperty('fullPrice') && offer.fullPrice > 0;
  };

  return (
    <Fragment>
      {
        (hasPrice() || hasDiscount()) &&
        <Fragment>
          <View style={styles.priceContainer}>
            {
              hasDiscount() ?
                <View style={[styles.discount, discountStyle]}>
                  <Text style={styles.discountText}>
                    {`-${offer.discount}%`}
                  </Text>
                </View> :
                <View style={{ flex: 1 }} />
            }
            <View style={styles.discountContainer}>
              {
                hasDiscount() && hasPrice() &&
                <Fragment>
                  <View style={styles.fullPrice}>
                    <Text style={styles.fullPriceText}>{`$${offer.fullPrice}`}</Text>
                  </View>
                  <View style={styles.newPrice}>
                    <Text style={styles.newPriceText}>
                      {`$${getPriceWithDiscount(offer.fullPrice, offer.discount)}`}
                    </Text>
                  </View>
                </Fragment>
              }
              {
                hasPrice() && !hasDiscount() &&
                <View style={styles.newPrice}>
                  <Text style={styles.newPriceText}>
                    {`$${offer.fullPrice}`}
                  </Text>
                </View>
              }
            </View>
          </View>
        </Fragment>
      }
    </Fragment>
  );
}

PriceInfo.propTypes = {
  offer: PropTypes.shape({
    discount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    fullPrice: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  discountStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
};

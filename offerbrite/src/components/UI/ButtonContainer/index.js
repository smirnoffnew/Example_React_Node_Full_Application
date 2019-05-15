import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'native-base';
import ButtonFavorite from '@/components/UI/ButtonFavorite';
import ButtonShare from '@/components/UI/ButtonShare';
import ButtonAlert from '@/components/UI/ButtonAlert';
import styles from './styles';

export default function ButtonContainer(props) {
  const {
    withShare,
    withReport,
    onReport,
    onAddFavorite,
    onRemoveFavorite,
    offer,
    wrapperStyle,
    header,
  } = props;

  const createButton = button => (
    <View style={styles.buttonContainer}>
      {button}
    </View>
  );

  const buttonShare = <ButtonShare offer={offer} />;
  const buttonReport = <ButtonAlert onPress={onReport} />;
  const buttonFavorite = (
    <ButtonFavorite
      header={header}
      active={offer.favorite}
      onPress={offer.favorite ? onRemoveFavorite : onAddFavorite}
    />
  );

  return (
    <View style={wrapperStyle}>
      <View style={styles.container}>
        {createButton(buttonFavorite)}
        {withShare ? createButton(buttonShare) : null}
        {withReport ? createButton(buttonReport) : null}
      </View>
    </View>
  );
}

ButtonContainer.propTypes = {
  withShare: PropTypes.bool,
  withReport: PropTypes.bool,
  onReport: PropTypes.func,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  offer: PropTypes.object.isRequired,
};

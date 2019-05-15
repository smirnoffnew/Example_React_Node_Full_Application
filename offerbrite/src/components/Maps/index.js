import React from 'react';
import PropTypes from 'prop-types';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Icon } from 'native-base';
import styles from './styles';

export default function Maps({ address, coords }) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          ...coords,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={coords}
          title={address || ''}
        >
          <Icon
            name="ios-pin"
            style={styles.icon}
          />
        </Marker>
      </MapView>
    </View>
  );
}

Maps.propTypes = {
  address: PropTypes.string,
  coords: PropTypes.exact({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
};

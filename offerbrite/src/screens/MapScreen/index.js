import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Maps from '@/components/Maps';
import AppHeader from '@/components/AppHeader';

import { selectors as searchSelectors } from '@/reducers/search';
import { convertAddressDataToString } from '@/services/helpers/geolocation';

class MapScreen extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Map" />
  }

  render() {
    const { offerLocation } = this.props;

    return (
      <Maps
        address={convertAddressDataToString(offerLocation.address)}
        coords={offerLocation.position}
      />
    );
  }
}

const mapStateToProps = state => ({
  offerLocation: searchSelectors.offerLocation(state),
});

MapScreen.propTypes = {
  offerLocation: PropTypes.shape({
    address: PropTypes.object.isRequired,
    position: PropTypes.exact({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
  }),
};

export default connect(mapStateToProps)(MapScreen);

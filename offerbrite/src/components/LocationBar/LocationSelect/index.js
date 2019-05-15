import React, { Component } from 'react';
import { GOOGLE_API_KEY } from 'react-native-dotenv';

import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { Content } from 'native-base';
import { View } from 'react-native';
import LocationInput from '@/components/LocationBar/LocationInput';
import LocationOption from '@/components/LocationBar/LocationOption';

class LocationSelect extends Component {

  state = {
    areOptionsVisible: false,
  }

  _showOptions = () => {
    this.setState({ areOptionsVisible: true });
  }

  _hideOptions = () => {
    this.setState({ areOptionsVisible: false });
  }

  _onTextEditHandler = (text, callback) => {
    this._showOptions();
    this.props.editUserAddress(text);
    callback(text);
  }

  render() {
    const { userLocation, setUserLocation, eraseLocation, header } = this.props;
    const { areOptionsVisible } = this.state;

    return (
      <GoogleAutoComplete
        apiKey={GOOGLE_API_KEY}
        debounce={500}
        minLength={3}
      >
        {
          ({ handleTextChange, locationResults, fetchDetails, isSearching }) => (
            <View>
              <LocationInput
                header={header}
                userLocation={userLocation}
                onChangeText={(text) => this._onTextEditHandler(text, handleTextChange)}
                value={userLocation.addressWithoutZIP ? userLocation.addressWithoutZIP : null}
                onEraseContent={eraseLocation}
              />
              {
                areOptionsVisible ?
                  <Content>
                    {locationResults.map(location => (
                      <LocationOption
                        {...location}
                        key={location.id}
                        fetchDetails={fetchDetails}
                        address={location.description}
                        onPress={setUserLocation}
                        locationResults={locationResults}
                        hideOptions={this._hideOptions}
                      />
                    ))}
                  </Content> :
                  null
              }
            </View>
          )
        }
      </GoogleAutoComplete>
    );
  }
}

export default LocationSelect;

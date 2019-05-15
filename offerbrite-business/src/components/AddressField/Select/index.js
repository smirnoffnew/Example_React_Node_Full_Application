import React, { Component } from 'react';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import PropTypes from 'prop-types';

import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { Content, View } from 'native-base';
import Input from '@/components/AddressField/Input';
import Option from '@/components/AddressField/Option';

class Select extends Component {

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
    this.props.editAddress(text, this.props.index);
    callback(text);
  }

  render() {
    const { storeAddress, setAddress, eraseAddress, onRemove, label, index } = this.props;
    const { areOptionsVisible } = this.state;

    return (
      <GoogleAutoComplete
        apiKey={GOOGLE_MAPS_API_KEY}
        debounce={500}
        minLength={3}
      >
        {
          ({ handleTextChange, locationResults, fetchDetails, isSearching }) => (
            <View>
              <Input
                label={label}
                onChangeText={(text) => this._onTextEditHandler(text, handleTextChange)}
                value={storeAddress ? storeAddress : null}
                onEraseContent={() => eraseAddress(index)}
                onRemove={onRemove ? onRemove : null}
              />
              {
                areOptionsVisible ?
                  <Content>
                    {locationResults.map(location => (
                      <Option
                        {...location}
                        key={location.id}
                        fetchDetails={fetchDetails}
                        address={location.description}
                        onPress={setAddress}
                        index={index}
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

Select.propTypes = {
  storeAddress: PropTypes.string,
  setAddress: PropTypes.func,
  eraseAddress: PropTypes.func,
  label: PropTypes.string,
};

export default Select;

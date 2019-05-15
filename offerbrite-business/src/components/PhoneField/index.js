import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryPicker from 'react-native-country-picker-modal';
import { TextInput, TouchableOpacity } from 'react-native';
import { View, Icon } from 'native-base';
import TextContent from '@/components/TextContent';
import styles, { countryPickerStyle } from './styles';

class PhoneField extends PureComponent {

  state = {
    isFocused: false,
  }

  _onToggleFocusHandler = () => this.setState(prevState => ({
    isFocused: !prevState.isFocused
  }))

  _onChange = text => {
    if (this.props.onChangeControl) {
      this.props.onChangeControl(text, this.props.id);
      this.props.input.onChange(text);
    } else {
      this.props.input.onChange(text);
    }
  }

  render() {
    const { ISOcode, callingCode, onChangeCallingCode, label, onEraseText, input, meta, onRemove } = this.props;

    return (
      <View style={styles.container}>
        <TextContent type="subtext">{label}</TextContent>
        <View style={styles.phoneNumberContainer}>
          <View style={styles.countrySelectorContainer}>
            <View style={styles.countrySelector}>
              <CountryPicker
                cca2={ISOcode}
                translation="eng"
                onChange={onChangeCallingCode}
                styles={countryPickerStyle}
              />
            </View>
            <TextContent style={styles.callingCodeContainer} type="regular">{callingCode}</TextContent>
          </View>
          <View style={styles.inputContainer}>
            <View style={[styles.inputBox, this.state.isFocused ? styles.inputOnFocus : styles.inputOnBlur]}>
              <TextInput
                onFocus={this._onToggleFocusHandler}
                onBlur={this._onToggleFocusHandler}
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholderTextColor="#000"
                value={input.value}
                onChangeText={this._onChange}
                {...this.props}
              />
              {
                onEraseText && input.value ?
                  <TouchableOpacity
                    style={styles.additionalContainer}
                    onPress={onEraseText}
                  >
                    <Icon
                      name="ios-close"
                      style={styles.eraseIcon}
                    />
                  </TouchableOpacity> :
                  null
              }
              {
                onRemove && !input.value ?
                  <TouchableOpacity
                    style={styles.additionalContainer}
                    onPress={onRemove}
                  >
                    <Icon
                      name="md-trash"
                      style={styles.trashIcon}
                    />
                  </TouchableOpacity> :
                  null
              }
            </View>
          </View>
        </View>
        {
          meta.touched && meta.error ?
            <TextContent color="danger" type="subtext">{meta.error}</TextContent> :
            null
        }
      </View>
    );
  }
}

PhoneField.propTypes = {
  ISOcode: PropTypes.string,
  callingCode: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  component: PropTypes.func,
  onEraseText: PropTypes.func,
  validate: PropTypes.array,
};

export default PhoneField;

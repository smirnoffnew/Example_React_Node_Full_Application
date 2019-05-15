import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextInput, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import TextContent from '@/components/TextContent';
import styles from './styles';

class Input extends Component {

  state = {
    isFocused: false,
  }

  _onToggleFocusHandler = () => this.setState(prevState => ({
    isFocused: !prevState.isFocused
  }))

  render() {
    const { value, label, onChangeText, onEraseContent, onRemove } = this.props;

    return (
      <View style={styles.inputContainer}>
        <TextContent type="subtext">{label || ' '}</TextContent>
        <View style={[styles.inputBox, this.state.isFocused ? styles.inputOnFocus : styles.inputOnBlur]}>
          <TextInput
            onFocus={this._onToggleFocusHandler}
            onBlur={this._onToggleFocusHandler}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholderTextColor="#000"
            value={value}
            onChangeText={onChangeText}
            {...this.props}
          />
          {
            onEraseContent && value ?
              <TouchableOpacity
                style={styles.additionalContainer}
                onPress={onEraseContent}
              >
                <Icon
                  name="ios-close"
                  style={styles.eraseIcon}
                />
              </TouchableOpacity> :
              null
          }
          {
            onRemove && !value ?
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
    );
  }
}

Input.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onChangeText: PropTypes.func,
  onEraseContent: PropTypes.func,
};

export default Input;

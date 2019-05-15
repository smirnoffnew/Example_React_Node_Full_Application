import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { TextInput, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';
import TextContent from '@/components/TextContent';
import styles from './styles';

class Input extends Component {

  state = {
    isFocused: false,
    isDataInvisible: this.props.secure ? true : false,
  }

  _onToggleDataVisibility = () => {
    this.setState(prevState => ({ isDataInvisible: !prevState.isDataInvisible }));
  }

  _onToggleFocusHandler = () => this.setState(prevState => ({
    isFocused: !prevState.isFocused
  }))

  render() {
    const { input, meta, label } = this.props;

    return (
      <React.Fragment>
        <View style={styles.inputContainer}>
          <TextContent type="subtext" color="default">{label || ' '}</TextContent>
          <View style={[styles.inputBox, this.state.isFocused ? styles.inputOnFocus : styles.inputOnBlur]}>
            <TextInput
              onFocus={this._onToggleFocusHandler}
              onBlur={this._onToggleFocusHandler}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholderTextColor="#000"
              value={input.value}
              secureTextEntry={this.state.isDataInvisible}
              onChangeText={input.onChange}
              {...this.props}
            />
            {
              this.props.onEraseText && input.value ?
                <TouchableOpacity
                  style={styles.additionalContainer}
                  onPress={this.props.onEraseText}
                >
                  <Icon
                    name="ios-close"
                    style={styles.eraseIcon}
                  />
                </TouchableOpacity> :
                this.props.secure ?
                  <TouchableOpacity
                    style={styles.additionalContainer}
                    onPress={this._onToggleDataVisibility}
                  >
                    <Icon
                      name={this.state.isDataInvisible ? 'ios-eye-off' : 'ios-eye'}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity> :
                  null
            }
          </View>
        </View>
        {
          meta.touched && meta.error ?
            <Animatable.View
              animation="lightSpeedIn"
            >
              <TextContent type="subtext" color="danger">{meta.error}</TextContent>
            </Animatable.View> :
            null
          }
      </React.Fragment>
    );
  }
}

// TODO: add prop types

export default Input;

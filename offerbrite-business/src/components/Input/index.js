import React, { Component } from 'react';

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
    const { input, meta, label, reference, additionalUnit } = this.props;

    return (
      <React.Fragment>
        <View style={styles.inputContainer}>
          <TextContent type="subtext">{label || ' '}</TextContent>
          <View style={[styles.inputBox, this.state.isFocused ? styles.inputOnFocus : styles.inputOnBlur]}>
            {
              additionalUnit &&
              <View style={styles.additionalUnitContainer}>
                <TextContent type="subtext">{additionalUnit}</TextContent>
              </View>
            }
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
              ref={reference}
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
          meta && meta.touched && meta.error ?
            <Animatable.View
              animation="lightSpeedIn"
            >
              <TextContent color="danger" type="subtext">{meta.error}</TextContent>
            </Animatable.View> :
            null
          }
      </React.Fragment>
    );
  }
}

export default Input;

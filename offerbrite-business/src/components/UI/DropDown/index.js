import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native';
import { View, Content, Icon, Text } from 'native-base';
import styles from './styles';

class DropDown extends Component {

  state = {
    showOptions: false,
  }

  _onToggleOptions = () => {
    this.setState(prevState => ({ showOptions: !prevState.showOptions }));
  }

  _onSelectItem = item => {
    this.props.onChangeItem(item);
    this.setState({ showOptions: false });
  }

  render() {
    const { items, selectedItem } = this.props;

    return (
      <Fragment>
        <TouchableOpacity
          onPress={this._onToggleOptions}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.textContent}>{selectedItem}</Text>
            <Icon
              style={styles.icon}
              name="ios-arrow-down"
            />
          </View>
        </TouchableOpacity>
        {
          this.state.showOptions ?
          <View style={styles.animationContainer}>
              <Animatable.View animation="fadeInDownBig">
              <Content contentContainerStyle={styles.dropDownContent}>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => this._onSelectItem(item)}
                    style={styles.dropDownItem}
                  >
                    <Text style={styles.textContent}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </Content>
            </Animatable.View>
            </View> :
            null
        }
      </Fragment>
    );
  }
}

DropDown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.string.isRequired,
  onChangeItem: PropTypes.func.isRequired,
};

export default DropDown;

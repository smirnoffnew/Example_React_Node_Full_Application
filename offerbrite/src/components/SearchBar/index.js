import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Icon, Text } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

import { actions as searchActions, selectors as searchSelectors } from '@/reducers/search';

class SearchBar extends Component {

  _hardleSearch = () => {
    this.props.resetSearchResults();
    this.props.getOffers();
  }

  render() {
    const { searchValue, onChangeSearch, header } = this.props;
    const statusBarHeight = getStatusBarHeight(true);

    return (
      <View style={[
        styles.container,
        { paddingTop: header ? 10 + statusBarHeight : 10 }
      ]}>
        <View style={styles.search}>
          <View style={styles.searchContainer}>
            <View style={styles.iconContainer}>
              <Icon name="search" style={styles.icon} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Search"
                onChangeText={text => onChangeSearch(text)}
                onSubmitEditing={this._hardleSearch}
                returnKeyType="search"
                value={searchValue}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={this._hardleSearch}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  searchValue: searchSelectors.searchValue(state),
});

const mapDispatchToProps = dispatch => ({
  getOffers: () => dispatch(searchActions.getOffers()),
  onChangeSearch: text => dispatch(searchActions.onChangeSearch(text)),
  resetSearchResults: () => dispatch(searchActions.resetSearchResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);

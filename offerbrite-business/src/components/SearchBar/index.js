import React from 'react';
import PropTypes from 'prop-types';

import { Container, View, Icon, Text } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function SearchBar(props) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <Icon name="search" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Search"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

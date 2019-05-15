import React from 'react';
import PropTypes from 'prop-types';

import { View, ListItem, Left, Right, Icon, Text } from 'native-base';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function ListClause(props) {
  let listClause;

  if (props.disabled) {
    listClause = (
      <ListItem
        noIndent
        style={styles.container}
      >
        <View style={styles.listItemContainer}>
          {
            props.title ?
              <TextContent type="subtext" color="default">{props.title}</TextContent> :
              null
          }
          <TextContent type="regular" color="dark">{props.content}</TextContent>
        </View>
      </ListItem>
    );
  } else {
    listClause = (
      <ListItem
        noIndent
        onPress={props.onPress}
        style={styles.container}
      >
        <Left>
          {
            props.danger ?
              <Text style={styles.textDanger}>{props.content}</Text> :
              <TextContent type="regular" color="dark">{props.content}</TextContent>
          }
        </Left>
        <Right>
          <Icon
            style={[styles.icon, props.danger ? styles.danger : styles.default]}
            name={props.editing ? 'arrow-down' : 'arrow-forward'}
          />
        </Right>
      </ListItem>
    );
  }

  return listClause;
}

ListClause.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  editing: PropTypes.bool,
};

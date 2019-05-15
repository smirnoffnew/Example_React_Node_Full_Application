import React, { Component } from 'react';

import { Container, Content, List } from 'native-base';
import AppHeader from '@/components/AppHeader';
import FormNameUpdate from '@/components/Forms/FormNameUpdate';
import FormEmailUpdate from '@/components/Forms/FormEmailUpdate';
import FormPasswordUpdate from '@/components/Forms/FormPasswordUpdate';
import FormUserDelete from '@/components/Forms/FormUserDelete';
import ListClauseSeparator from '@/components/UI/ListClauseSeparator';
import styles from './styles';

class EditProfile extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Edit profile" />,
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <List>
            <FormNameUpdate />
            <FormEmailUpdate />
            <FormPasswordUpdate />
            <ListClauseSeparator />
            <FormUserDelete />
          </List>
        </Content>
      </Container>
    );
  }
}

export default EditProfile;

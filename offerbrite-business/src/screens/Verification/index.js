import React, { Component } from 'react';

import { Container, View } from 'native-base';
import ContentScroll from '@/components/UI/ContentScroll';
import TextContent from '@/components/TextContent';
import AppHeader from '@/components/AppHeader';
import ButtonSquare from '@/components/UI/ButtonSquare';
import styles from './styles';

class Verification extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Verification" type="empty" />
  }

  constructor(props) {
    super(props);
    this.verificationInProcess = this.props.navigation.getParam('verificationInProcess');
  }

  render() {
    const { navigation } = this.props;

    let text = {
      firstLine: 'To improve delivery of your offers,',
      secondLine: 'verify your account',
    };

    let buttons = (
      <View style={styles.buttonContainer}>
        <ButtonSquare
          onPress={() => navigation.navigate('VerifyAccount')}
          light
        >
          Verify account
        </ButtonSquare>
        <View style={{ marginVertical: 10 }} />
        <ButtonSquare
          onPress={() => navigation.navigate('Offers')}
          primary
        >
          Thank's, later
        </ButtonSquare>
      </View>
    );

    if (this.verificationInProcess) {
      text.firstLine = 'Thank you, your application will be';
      text.secondLine = 'reviewed by our moderation';
      buttons = (
        <View style={styles.buttonContainer}>
          <ButtonSquare
            onPress={() => navigation.navigate('Offers')}
            light
          >
            Ok
          </ButtonSquare>
        </View>
      );
    }

    return (
      <Container style={styles.container}>
        <ContentScroll style={styles.content}>
          <View style={styles.textContainer}>
            <TextContent
              type="regular"
              color="light"
            >
              {text.firstLine}
            </TextContent>
            <TextContent
              type="regular"
              color="light"
            >
              {text.secondLine}
          </TextContent>
          </View>
          {buttons}
        </ContentScroll>
      </Container>
    );
  }
}

export default Verification;

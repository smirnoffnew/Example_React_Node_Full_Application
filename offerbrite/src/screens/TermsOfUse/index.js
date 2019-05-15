import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import AuthHeader from '@/components/AuthHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import TextContent from '@/components/TextContent';
import Checkbox from '@/components/UI/Checkbox';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';
import withNotification from '@/hoc/withNotification';
import tempTerms from './tempTerms';
class TermsOfUse extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Terms of use" />,
  }

  state = {
    terms: tempTerms,
    termsAccepted: false,
    signupDisabled: true,
  }

  componentDidMount() {
    // TODO: get real terms of use
    // this.props.requestStart();
    // axios.get('https://baconipsum.com/api/?type=meat-and-filler')
    //   .then(response => {
    //     this.setState({ terms: response.data });
    //     this.props.requestSuccess();
    //   })
    //   .catch(error => {
    //     this.props.requestFail(error);
    //   });
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      this.props.navigation.navigate('App');
    }
  }

  _onCheckboxToggleHandler = () => {
    this.setState(prevState => ({
      termsAccepted: !prevState.termsAccepted,
      signupDisabled: !prevState.signupDisabled,
    }));
  }

  _onSignUp = () => {
    this.props.signup();
  }

  render() {
    const { terms, termsAccepted, signupDisabled } = this.state;
    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View>
            {
              terms ?
                terms.map((term, index) => (
                  <TextContent
                    key={index}
                    type="regular"
                    color="dark"
                    style={{ marginVertical: 5 }}
                  >
                    {term}
                  </TextContent>
                )) :
                null
            }
          </View>
          <View style={styles.buttonContainer}>
            {
              terms ?
                <Checkbox
                  onPress={this._onCheckboxToggleHandler}
                  checked={termsAccepted}
                  title="I agree with all terms"
                  position="center"
                /> :
                null
            }
            <ButtonRounded
              onPress={this._onSignUp}
              theme={signupDisabled ? 'disabled' : 'danger'}
            >
              Sign up
            </ButtonRounded>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: sessionSelectors.user(state),
});

const mapDispatchToProps = dispatch => ({
  signup: () => dispatch(sessionActions.signup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withNotification(TermsOfUse));

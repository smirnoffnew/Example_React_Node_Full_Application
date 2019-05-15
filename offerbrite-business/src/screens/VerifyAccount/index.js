import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Content, View } from 'native-base';
import { TextInput } from 'react-native';
import AppHeader from '@/components/AppHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import TextContent from '@/components/TextContent';
import ImageContainer from '@/components/ImageContainer';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import ButtonSquare from '@/components/UI/ButtonSquare';
import styles from './styles';

import { actions as verificationActions, selectors as verificationSelectors } from '@/reducers/verification';

class VerifyAccount extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Verify account" type="withBackButton" />
  }

  _onSubmit = () => {
    // TODO: POST images to the backend
    // if response is OK
    this.props.navigation.navigate('Verification', { verificationInProcess: true });
  }

  render() {
    const { photos, pickImage, addNewImage, comment, onChangeComment } = this.props;

    return (
      <Container>
        <ContentScroll>
          <TextContent
            style={styles.descriptionContainer}
            type="regularSmall"
            color="dark"
          >
            You must add photo documents that confirm that you are the owner of this business
          </TextContent>
          <TextContent type="subtext">Photo</TextContent>
          {
            photos.map((photo, index) => (
              <View key={index} style={styles.imageContainer}>
                <ImageContainer
                  editable
                  square
                  onPress={() => pickImage(index)}
                  imageUrl={photo.imageUrl}
                />
              </View>
            ))
          }
          {
            photos.length < 5 ?
              <ButtonTransparent
                position="right"
                onPress={addNewImage}
              >
                + Add more photos
              </ButtonTransparent> :
              null
          }
          <TextContent
            style={styles.labelContainer}
            type="subtext"
          >
            Comment
          </TextContent>
          <Content showsVerticalScrollIndicator contentContainerStyle={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={5}
              underlineColorAndroid="transparent"
              placeholderTextColor="#000"
              placeholder="These documents confirm that I own this business..."
              onChangeText={onChangeComment}
              value={comment}
            />
          </Content>
          <View style={styles.buttonContainer}>
            <ButtonSquare
              onPress={this._onSubmit}
              primary
            >
              Send
            </ButtonSquare>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  photos: verificationSelectors.photos(state),
  comment: verificationSelectors.comment(state),
});

const mapDispatchToProps = dispatch => ({
  pickImage: index => dispatch(verificationActions.pickImage(index)),
  addNewImage: () => dispatch(verificationActions.addNewImage()),
  onChangeComment: text => dispatch(verificationActions.onChangeComment(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyAccount);

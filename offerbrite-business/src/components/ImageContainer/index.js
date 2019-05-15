import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import responsiveComponent from '@/hoc/responsiveComponent';
import { TouchableOpacity } from 'react-native';
import { Thumbnail, View, Icon } from 'native-base';
import styles from './styles';

function ImageContainer({ onPress, imageUrl, circle, editable, screenWidth }) {
  const defaultStyle = {
    width: '100%',
    borderRadius: 5,
    height: Math.round(screenWidth * 0.42),
    maxHeight: 300,
  };

  return (
    <Fragment>
      {
        imageUrl ?
          <View style={styles.container}>
            <View style={[
              styles.imageContainer,
              circle ?
                styles.circle :
                defaultStyle
              ]}>
              <Thumbnail
                source={{ uri: imageUrl }}
                style={styles.image}
                square
              />
            </View>
            {
              editable ?
                <TouchableOpacity
                  onPress={onPress}
                  style={styles.editIconContainer}
                >
                  <Icon
                    name="md-create"
                    style={styles.editIcon}
                  />
                </TouchableOpacity> :
                null
            }
          </View> :
          <TouchableOpacity
            activeOpacity={editable ? 0.5 : 1}
            onPress={onPress}
            style={styles.container}
          >
            <View style={[
              styles.imageContainer,
              styles.withBorder,
              circle ? styles.circle : defaultStyle,
            ]}>
              <Thumbnail
                source={require('../../../assets/images/camera.png')}
                square
              />
            </View>
          </TouchableOpacity>
      }
    </Fragment>
  );
}

ImageContainer.propTypes = {
  onPress: PropTypes.func,
  imageUrl: PropTypes.string,
  circle: PropTypes.bool,
  editable: PropTypes.bool,
};

export default responsiveComponent(ImageContainer);

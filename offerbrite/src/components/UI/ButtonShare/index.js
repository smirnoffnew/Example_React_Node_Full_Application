import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity, Share, Platform } from 'react-native';
import { View, Icon } from 'native-base';
import styles from './styles';

import { GA_trackShare } from '@/services/analytics';
import { statisticsAddShare } from '@/services/api';

class ButtonShare extends Component {

  _handleShare = async () => {
    const { offer } = this.props;
    const result = await Share.share({
      ...Platform.select({
        ios: {
          message: `${offer.title}
Look at this offer: ${offer.imagesUrls[0]}
Download the app here: https://www.apple.com/lae/ios/app-store/
`,
          url: this.props.offer.imagesUrls[0],
        },
        android: {
          message: `${this.props.offer.title}
Look at this offer: ${this.props.offer.imagesUrls[0]}
Download the app here: https://play.google.com/store/apps?hl=en
`,
        }
      }),
      title: 'Wow, did you see that?'
    },
      {
        ...Platform.select({
          ios: {
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter'
            ]
          },
          android: {
            dialogTitle: 'Share this offer : ' + this.props.offer.title
          }
        })
      });

    if (result.action === 'sharedAction') {
      GA_trackShare(offer);
      statisticsAddShare(offer.id);
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._handleShare}
          style={styles.shareButton}
        >
          <Icon
            name="share"
            style={styles.shareIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ButtonShare.propTypes = {
  offer: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imagesUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ButtonShare;

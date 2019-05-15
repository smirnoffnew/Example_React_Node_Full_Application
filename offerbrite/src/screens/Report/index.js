import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TouchableWithoutFeedback, TouchableOpacity, Modal } from 'react-native';
import { Container, View, Icon } from 'native-base';
import AppHeader from '@/components/AppHeader';
import RadioButton from '@/components/UI/RadioButton';
import TextContent from '@/components/TextContent';
import ButtonSquare from '@/components/UI/ButtonSquare';
import styles from './styles';

import { actions as reportActions, selectors as reportSelectors } from '@/reducers/report';

class Report extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Report" />
  }

  constructor(props) {
    super(props);
    this.offerId = this.props.navigation.getParam('offerId');
  }

  state = {
    isModalVisible: false,
  }

  _handleReport = reason => {
    this.props.onReport(this.offerId, reason);
    this._toggleModalVisibility();
  }

  _toggleModalVisibility = () => {
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  _handleModalClose = () => {
    this._toggleModalVisibility();
    this.props.resetReportStatus();
    this.props.navigation.goBack(null);
  }

  render() {
    const { reportReasons, selectedReason, onChangeReason, isReportSuccess } = this.props;
    const statusBarHeight = getStatusBarHeight(true);

    let reportStatus = ' ';
    if (isReportSuccess === true) {
      reportStatus = 'Thank you, your application will be reviewed by our moderation';
    } else if (isReportSuccess === false) {
      reportStatus = 'Sorry, something went wrong. Try again later.';
    }

    return (
      <Container style={styles.container}>
        <View style={styles.content}>
          <TextContent
            type="regular"
            color="darkGray"
            style={{ marginBottom: '10%' }}
          >
            Reason for complaint
          </TextContent>
          {
            reportReasons.map((reason, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => onChangeReason(reason)}>
                <View style={styles.reasonItem}>
                  <RadioButton checked={selectedReason === reason} />
                  <TextContent type="subtext" color="darkGray">{reason}</TextContent>
                </View>
              </TouchableWithoutFeedback>
            ))
          }
        </View>
        <View style={styles.buttonContainer}>
          <ButtonSquare danger onPress={() => this._handleReport(selectedReason)}>
            Send
          </ButtonSquare>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isModalVisible}
          onRequestClose={this._toggleModalVisibility}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalHeader, { paddingTop: 20 + statusBarHeight }]}>
              <View style={{ flex: 1 }} />
              <TextContent
                color="light"
                type="regular"
                center
                style={styles.modalHeaderTextContainer}
              >
                Report
              </TextContent>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={this._toggleModalVisibility}
              >
                <Icon
                  name="md-close"
                  style={styles.modalCloseButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TextContent
                center
                type="subtext"
                color="light"
                style={styles.content}
              >
                {reportStatus}
              </TextContent>
              <View style={styles.buttonContainer}>
                <ButtonSquare
                  onPress={this._handleModalClose}
                  light
                >
                  Ok
                </ButtonSquare>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isReportSuccess: reportSelectors.isReportSuccess(state),
  reportReasons: reportSelectors.reportReasons(state),
  selectedReason: reportSelectors.selectedReason(state),
});

const mapDispatchToProps = dispatch => ({
  onChangeReason: reason => dispatch(reportActions.onChangeReason(reason)),
  onReport: (offerId, reason) => dispatch(reportActions.onReport(offerId, reason)),
  resetReportStatus: () => dispatch(reportActions.resetReportStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Modal, View, ActivityIndicator } from 'react-native';
import styles from './styles';

import { selectors as requestSelectors } from '@/reducers/request';
import { notify } from '@/services/helpers/notification';

class Notification extends Component {

  state = {
    isLoading: false,
  }

  componentDidUpdate(prevProps) {
    if (this.props.notification) {
      notify(this.props.notification);
    }

    if (this.props.loading !== prevProps.loading) {
      this._onToggleLoadingState();
    }
  }

  _onToggleLoadingState = () => {
    this.setState({ isLoading: this.props.loading });
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isLoading}
        onRequestClose={() => null}
      >
        <View style={styles.modal}>
          <ActivityIndicator
            color="#fff"
            size="large"
          />
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  notification: requestSelectors.notification(state),
  loading: requestSelectors.loading(state),
});

export default connect(mapStateToProps)(Notification);

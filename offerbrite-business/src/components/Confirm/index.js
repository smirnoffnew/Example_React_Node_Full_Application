import React from 'react';
import PropTypes from 'prop-types';

import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text } from 'react-native';
import TextContent from '@/components/TextContent';
import styles from './styles';

export default function Confirm({ visible, onClose, onConfirm, children }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <TextContent
            type="subtext"
            color="dark"
            center
            style={{ marginTop: 20 }}
          >
            {children}
          </TextContent>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

Confirm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.string,
};

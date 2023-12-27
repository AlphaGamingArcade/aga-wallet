import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';

const TestingModal = forwardRef(function TestingModal(props, ref) {
  const [visible, setVisible] = useState(false);
  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: openModal,
      close: closeModal,
    }),
    []
  );

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <Text onPress={closeModal}>hereee</Text>
      </View>
    </Modal>
  );
});

export default TestingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});

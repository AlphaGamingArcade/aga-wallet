import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

const OptionModal = forwardRef(function OptionModal(props, ref) {
  const [visible, setVisible] = useState(true);

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
    <Modal
      transparent
      visible={visible}
      onRequestClose={closeModal}
      animationType="fade"
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backDrop} />
        </TouchableWithoutFeedback>
        <View style={styles.content}>{props.children}</View>
      </SafeAreaView>
    </Modal>
  );
});

export default OptionModal;

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.1)',
  },

  container: {
    position: 'absolute',
    width: 150,
    height: 100,
    backgroundColor: 'red',
    right: 0,
    bottom: 0,
  },
});

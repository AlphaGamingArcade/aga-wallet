import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Modal,
  Animated,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

const NotificationModal = forwardRef(function NotificationModal(props, ref) {
  const [visible, setVisible] = useState(false);
  const opacityValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  const openModal = () => {
    setVisible(true);

    Animated.parallel([
      Animated.spring(opacityValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.spring(opacityValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: openModal,
      close: closeModal,
    }),
    []
  );

  const animatedStyle = {
    opacity: opacityValue,
    transform: [{ scale: scaleValue }],
  };

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={closeModal}
      animationType='fade'
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backDrop} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.notificationModal, animatedStyle]}>
          <View style={styles.content}>{props.children}</View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
});

export default NotificationModal;

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  notificationModal: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
});

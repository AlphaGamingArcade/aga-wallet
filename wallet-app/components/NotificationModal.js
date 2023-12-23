import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Modal, Animated, Text, TouchableWithoutFeedback } from 'react-native';

const NotificationModal = forwardRef(function NotificationModal(props, ref) {
  const [visible, setVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current; 

  const openModal = () => {
    setVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1, 
      useNativeDriver: true, 
    }).start();
  };

  const closeModal = () => {
    setVisible(false)
    scaleValue.setValue(0)
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
    transform: [{ scale: scaleValue }],
  };



  return (
    <Modal transparent visible={visible}  statusBarTranslucent onRequestClose={closeModal}>
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
    height: 'auto',
    borderRadius: 5,
  },
  content: {
    padding: 20,
  },
});

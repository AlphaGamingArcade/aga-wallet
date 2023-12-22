import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';

const CustomDrawer = forwardRef(function CustomDrawer(props, ref) {
  const translateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const [visible, setVisible] = useState(false);

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      open: openDrawer,
      close: closeDrawer,
    }),
    []
  );

  return (
    <Modal transparent visible={visible} statusBarTranslucent onRequestClose={closeDrawer}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View
            style={[
              styles.backDrop,
              {
                opacity: translateX.interpolate({
                  inputRange: [0, Dimensions.get('window').width / 2],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.content}>{props.children}</View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
});

export default CustomDrawer;

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '85%',
    alignSelf: 'flex-end',
    backgroundColor: '#FFF',
  },
  content: {
    padding: 0,
    flex: 1,
    height: '100%',
  },
});

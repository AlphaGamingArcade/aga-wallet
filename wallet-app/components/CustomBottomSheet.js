import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Modal,
  Animated,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const CustomBottomSheet = forwardRef(function CustomBottomSheet(props, ref) {
  const bottomSheetHeight = props.height || '65%';
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [visible, setVisible] = useState(false);

  const showBottomSheet = () => {
    setVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideBottomSheet = () => {
    Animated.timing(translateY, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleBackdropPress = () => {
    hideBottomSheet();
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          showBottomSheet();
        },
        close() {
          hideBottomSheet();
        },
      };
    },
    []
  );

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 5 && gestureState.dy > Math.abs(gestureState.dx), // Adjust sensitivity and ignore horizontal movements
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          hideBottomSheet();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={hideBottomSheet}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: translateY.interpolate({
                  inputRange: [0, Dimensions.get('window').height / 2],
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
              height: bottomSheetHeight,
            },
            {
              transform: [{ translateY }],
            },
          ]}
          {...(!props.disableSwipeDownClose ? panResponder.panHandlers : {})}
        >
          <View style={styles.content}>
            <View style={styles.bottomSheetIndicator}>
              <TouchableOpacity onPress={handleBackdropPress} style={styles.indicatorIconBtn}>
                <View style={styles.indicatorIcon}></View>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomSheetContent}>{props.children}</View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
});

export default CustomBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 0,
    flex: 1,
    height: '100%',
  },
  bottomSheetIndicator: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIconBtn: {
    padding: 10,
  },
  indicatorIcon: {
    height: 4,
    width: 35,
    borderRadius: 4,
    backgroundColor: '#585858',
  },
  bottomSheetContent: {
    height: '100%',
    paddingBottom: 20,
  },
});

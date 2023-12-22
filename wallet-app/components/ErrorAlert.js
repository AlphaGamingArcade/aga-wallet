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
  Image,
} from 'react-native';
import AlertErrorIcon from '../assets/error-icon.png';
import { COLORS } from '../utils/app_constants';

const ErrorAlert = forwardRef(function ErrorAlert(props, ref) {
  const [visible, setVisible] = useState(false);

  const showAlert = () => {
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        show() {
          showAlert();
        },
        close() {
          hideAlert();
        },
      };
    },
    []
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.content}>
            {/* <Image source={AlertErrorIcon} style={styles.assetIcon} /> */}
            <Text style={styles.errorTitleText}>{props.title}</Text>
            <Text style={styles.errorMessageText}>{props.message}</Text>
            <View style={styles.divider}></View>
            <TouchableOpacity style={styles.closeBtn} onPress={hideAlert}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

export default ErrorAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 24,
  },
  closeBtn: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    height: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  closeBtnText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    fontSize: 16,
  },
  assetIcon: {
    width: '60%',
    height: 120,
  },
  errorTitleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  errorMessageText: {
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.LIGHT_GRAY,
    marginVertical: 20,
    borderRadius: 10,
  },
});

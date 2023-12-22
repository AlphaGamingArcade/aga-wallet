import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import AgaLogoFull from '../assets/aga-logo-full.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/app_constants';

export default function PasscodeScreen({ navigation }) {
  const [passcode, setPasscode] = useState('');
  const [activeBtns, setActiveBtns] = useState(Array(6).fill(false));
  const [error, setError] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [attemptCount, setAttemptCount] = useState();

  const passcodeInputRef = useRef(null);

  const getAttempt = async () => {
    const attempt = await AsyncStorage.getItem('attempt');
    if (!attempt) {
      setAttemptCount(5);
      await AsyncStorage.setItem('attempt', '5');
    }

    setAttemptCount(parseInt(attempt));

    if (attemptCount === 0) {
      const target = new Date(new Date().setMinutes(new Date().getMinutes() + 1)).toISOString();
      console.log(target);

      setError(null);
      await AsyncStorage.removeItem('attempt');
      await AsyncStorage.setItem('lock', target);
      navigation.navigate('lock');
    }
    if (attemptCount < 5 && attemptCount > 0)
      setError(
        `Incorrect passcode. The app will be locked for 30 minutes after ${attemptCount} failed attempts.`
      );

    console.log(attemptCount, 'zzzzzzzzzzz');
  };

  const setAttempt = async () => {
    await AsyncStorage.setItem('attempt', String(attemptCount - 1));
    console.log(attemptCount, 'xxxxxxxxxx');
  };

  const removeItem = async () => {
    console.log('remove');
    setError(null);
    await AsyncStorage.removeItem('attempt');
  };

  getAttempt();

  useEffect(() => {
    let shake;

    if (passcode.length === 6 && passcode === '123456') {
      console.log(passcode);
      setError(null);
      removeItem();
      navigation.navigate('index');
    } else if (passcode.length === 6 && passcode !== '123456') {
      setAttempt();

      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -2, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      shake = setInterval(() => {
        setPasscode('');
        setActiveBtns(Array(6).fill(false));
      }, 200);
    }

    return () => {
      clearInterval(shake);
    };
  }, [passcode]);

  const onChangePasscode = (value) => {
    setPasscode(value);

    const updatedBtns = Array(6).fill(false);
    for (let i = 0; i < value.length; i++) updatedBtns[i] = true;
    setActiveBtns([...updatedBtns]);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.upperContainer}>
        <Image style={styles.agaLogo} source={AgaLogoFull} />
        <View style={styles.passcodeContainer}>
          <Text style={styles.headerText}>AGA Wallet</Text>
          <Text style={styles.subText}>Enter your password</Text>
          <View style={styles.pinCodeWrapper}>
            {activeBtns.map((isActiveBtn, index) => (
              <Animated.View key={index}>
                <TouchableOpacity
                  style={[
                    isActiveBtn
                      ? [styles.passcodeBtnActive, { transform: [{ translateX: shakeAnimation }] }]
                      : styles.passcodeBtn,
                  ]}
                  onPress={() => {
                    console.log('This is clicked');
                    setTimeout(() => passcodeInputRef.current?.focus(), 0);
                  }}
                ></TouchableOpacity>
              </Animated.View>
            ))}
            <TextInput
              style={styles.hiddenInput}
              onChangeText={onChangePasscode}
              value={passcode}
              ref={passcodeInputRef}
              maxLength={6}
              keyboardType="numeric"
              selectionColor={'transparent'}
            />
          </View>
          <View style={styles.errorContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.resetContainer}>
        <Text style={styles.resetQuestionText}>Having trouble logging in?</Text>
        <Text style={styles.resetQuestionText}>You can reset wallet and setup a new one</Text>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity>
            <Text style={styles.helpCenterText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.resetText}>Reset wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 96,
  },
  upperContainer: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 96,
    width: '100%',
  },
  agaLogo: {
    height: 104,
    width: 221,
  },
  headerText: {
    fontSize: 32,
    fontFamily: 'Poppins-Medium',
  },
  passcodeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  passcodeInput: {
    width: '100%',
    borderWidth: 2,
    fontFamily: 'Poppins-Bold',
  },
  subText: {
    fontFamily: 'Poppins-Regular',
    color: '#838383',
    fontSize: 14,
  },
  resetContainer: {
    marginTop: 'auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetQuestionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#707070',
  },
  actionBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  helpCenterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  resetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    width: 280,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  pinCodeWrapper: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingLeft: 25,
  },
  hiddenInput: {
    height: 20,
    position: 'absolute',
    backgroundColor: 'transparent',
    color: 'transparent',
    width: '100%',
    maxWidth: 250,
    paddingHorizontal: 15,
    fontSize: 0,
  },
  passcodeBtn: {
    width: 20,
    height: 20,
    borderColor: COLORS.PRIMARY,
    borderRadius: 50,
    borderWidth: 2,
  },
  passcodeBtnActive: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
  },
  errorContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#838383',
  },
});

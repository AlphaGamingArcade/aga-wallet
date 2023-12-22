import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ArrowLeftV2 from '../assets/arrow-left-v2.png';
import { genericPostRequest } from '../services/api/genericPostRequest';
import { genericGetRequest } from '../services/api/genericGetRequest';
import ErrorAlert from '../components/ErrorAlert';
import {
  APP_STATUS,
  COLORS,
  COUNTRY_CODE,
  FONT_FAMILY,
  FONT_SIZE,
  STATUS_TYPE,
} from '../utils/app_constants';
import SignUpAccountProfile from '../components/SignUpAccountProfile';
import SignUpCredentials from '../components/SignUpCredentials';
import SignUpDataPrivacyAndPolicy from '../components/SignUpDataPrivacy';
import useFormErrors from '../hooks/useFormErrors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToken } from '../services/store/token/tokenContext';
import { useWallets } from '../services/store/wallets/walletsContext';
import { useUser } from '../services/store/user/userContext';
import io from 'socket.io-client';

const signUpSteps = [
  {
    stepIndex: 1,
    header: 'Create your',
    subHeader: 'Profile',
  },
  {
    stepIndex: 2,
    header: 'Set your',
    subHeader: 'Credentials',
  },
  {
    stepIndex: 3,
    header: 'Data privacy',
    subHeader: '',
  },
];

export default function SignUpScreen({ navigation }) {
  const tokenContext = useToken();
  const walletsContext = useWallets();
  const userContext = useUser();

  const [stepIndex, setStepIndex] = useState(0);
  const errorAlertRef = useRef(null);
  const { formErrors, setFormErrors, resetFormErrors } = useFormErrors([
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'password',
    'confirmPassword',
    'signUp',
  ]);
  const [status, setStatus] = useState(APP_STATUS.IDLE);

  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [email, onChangeEmail] = useState();
  const [phone, onChangePhone] = useState('');
  const phoneNumber = `${COUNTRY_CODE}${phone}`;
  const [password, onChangePassword] = useState('');
  const [confirmPassword, onChangeConfirmPassword] = useState('');

  const onPressSignInLink = () => {
    navigation.navigate('signin');
  };

  const onPressNext = async () => {
    resetFormErrors();
    if (stepIndex === 0) {
      try {
        setStatus(APP_STATUS.LOADING);
        if (firstName.length <= 0) {
          return setFormErrors('firstName', 'Invalid first name');
        }
        if (lastName.length <= 0) {
          return setFormErrors('lastName', 'Invalid last name');
        }
        if (email.length <= 0) {
          return setFormErrors('email', 'Invalid last name');
        }
        const res = await genericGetRequest(`users/emails/${email}`);
        if (res.available) {
          setStepIndex((stepIndex) => stepIndex + 1);
        } else {
          setFormErrors('email', 'Email is no longer available');
        }
      } catch (error) {
        setFormErrors('email', 'Invalid email');
      } finally {
        setStatus(APP_STATUS.IDLE);
      }
    } else if (stepIndex === 1) {
      try {
        setStatus(APP_STATUS.LOADING);
        if (phone.length <= 7) {
          return setFormErrors('phoneNumber', 'Invalid phone number');
        }
        const res = await genericGetRequest(`users/phone-numbers/${phoneNumber}`);

        if (!res.available) {
          return setFormErrors('phoneNumber', 'Phone number no longer available');
        }
        if (password.length <= 7) {
          return setFormErrors('password', 'Minimum of 8 characters');
        }
        if (password != confirmPassword) {
          return setFormErrors('confirmPassword', 'Confirm password not the same');
        }
        if (res.available) {
          setStepIndex((stepIndex) => stepIndex + 1);
        }
      } catch (error) {
        setFormErrors('phoneNumber', 'Invalid phone number');
      } finally {
        setStatus(APP_STATUS.IDLE);
      }
    } else if (stepIndex === 2) {
      setStatus(APP_STATUS.LOADING);
      try {
        const res = await genericPostRequest('users/signup', {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: `${phoneNumber}`,
          password: confirmPassword,
          passcode: 1234,
        });

        const userData = res?.user ?? {};
        const walletsData = res?.wallets ?? [];
        const tokenData = res?.token ?? '';

        const user = ['@AgaWallet_USER', JSON.stringify(userData)];
        const wallets = ['@AgaWallet_WALLETS', JSON.stringify(walletsData)];
        const token = ['@AgaWallet_TOKEN', JSON.stringify(tokenData)];

        await AsyncStorage.multiSet([user, wallets, token]);

        userContext.updateUser(userData);
        walletsContext.updateWallets(walletsData);
        if (walletsData?.length > 0) {
          walletsContext?.updateSelectedWallet(walletsData[0]);
        }
        tokenContext.updateToken(tokenData);

        await AsyncStorage.multiSet([user, wallets, token]);

        const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
          transports: ['websocket'],
        });
        socket.emit('setUserID', { userID: userData?.id ?? '' });

        navigation.navigate('index');
      } catch (error) {
        console.log(error);
        setFormErrors('signUp', error?.response?.data?.message ?? 'Unexpected error occured');
        errorAlertRef.current?.show();
      } finally {
        setStatus(APP_STATUS.IDLE);
      }
    }
  };

  const onPressBack = () => {
    if (stepIndex <= 0) {
      navigation.goBack();
    } else {
      setStepIndex((stepIndex) => stepIndex - 1);
    }
  };

  const stepNumber = stepIndex + 1;

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.signUpStepperContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <Image source={ArrowLeftV2} style={styles.backIcon}></Image>
        </TouchableOpacity>
        <Text style={styles.stepText}>
          Step {stepNumber}/{signUpSteps.length}
        </Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTextFirst}>{signUpSteps[stepIndex].header}</Text>
          {stepNumber !== 3 && (
            <Text style={styles.headerTextSecond}>{signUpSteps[stepIndex].subHeader}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          {stepNumber === 1 && (
            <SignUpAccountProfile
              formErrors={formErrors}
              firstName={firstName}
              lastName={lastName}
              email={email}
              onChangeFirstName={onChangeFirstName}
              onChangeLastName={onChangeLastName}
              onChangeEmail={onChangeEmail}
            />
          )}
          {stepNumber === 2 && (
            <SignUpCredentials
              formErrors={formErrors}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              onChangePhone={onChangePhone}
              onChangePassword={onChangePassword}
              onChangeConfirmPassword={onChangeConfirmPassword}
            />
          )}
          {stepNumber === 3 && <SignUpDataPrivacyAndPolicy />}
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          disabled={status === APP_STATUS.LOADING}
          style={[styles.button, status === APP_STATUS.LOADING && styles.disabledNextBtn]}
          onPress={onPressNext}
        >
          {status === APP_STATUS.LOADING ? (
            <ActivityIndicator size="large" color={COLORS.WHITE} />
          ) : (
            <Text style={styles.buttonText}>{stepIndex === 2 ? 'Sign up' : 'Next'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSignInLink}>
          <Text style={styles.loginInfoText}>Login to your existing account</Text>
        </TouchableOpacity>
      </View>
      <ErrorAlert
        ref={errorAlertRef}
        title="Failed signing you up."
        message={formErrors.signUp.message}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  backBtn: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
  },
  backIcon: {
    height: 21,
    width: 21,
  },
  signUpStepperContainer: {
    paddingHorizontal: 30,
    marginTop: 50,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: FONT_SIZE.REGULAR,
  },
  headerContainer: {
    marginTop: 45,
  },
  headerTextFirst: {
    fontSize: FONT_SIZE.EXTRA_LARGE + 10,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.BLACK,
  },
  headerTextSecond: {
    marginTop: -30,
    fontSize: FONT_SIZE.EXTRA_LARGE + 12,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.PRIMARY,
  },
  inputContainer: {
    marginTop: 31,
    height: 'auto',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 55,
  },
  disabledNextBtn: {
    backgroundColor: COLORS.DISABLED_GRAY,
    elevation: 0,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  actionButtonContainer: {
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    top: 'auto',
    paddingBottom: 20,
  },
  signUpText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  loginInfoText: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#838383',
  },
});

import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { genericPostRequest } from '../services/api/genericPostRequest';
import ErrorAlert from '../components/ErrorAlert';
import { APP_STATUS, COLORS, COUNTRY_CODE, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import TextInput from '../components/ui/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlagIcon from '../assets/flag-icon.png';
import LockIcon from '../assets/lock-icon.png';
import WalletLogo from '../assets/aga-wallet-logo.png';
import { useUser } from '../services/store/user/userContext';
import { useWallets } from '../services/store/wallets/walletsContext';
import { useToken } from '../services/store/token/tokenContext';
import io from 'socket.io-client';

export default function SignInScreen({ navigation }) {
  const userContext = useUser();
  const walletsContext = useWallets();
  const tokenContext = useToken();

  const errorAlertRef = useRef(null);
  const [error, setError] = useState({ title: '', message: '' });
  const [status, setStatus] = useState(APP_STATUS.IDLE);

  const [phone, onChangePhone] = useState('');
  const phoneNumber = `${COUNTRY_CODE}${phone}`;
  const [password, onChangePassword] = useState('');

  const onPressSubmit = async () => {
    try {
      setStatus(APP_STATUS.LOADING);
      const res = await genericPostRequest('users/signin', {
        phone_number: phoneNumber,
        password: password,
      });
      const keys = ['@AgaWallet_USER', '@AgaWallet_WALLETS', '@AgaWallet_TOKEN'];
      await AsyncStorage.multiRemove(keys);

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

      const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        transports: ['websocket'],
      });
      socket.emit('setUserID', { userID: userData?.id ?? '' });

      navigation.navigate('index');
    } catch (error) {
      const errorMessage = error?.response?.data?.message ?? 'Unexpected error occured';
      setError({ title: `Login failed`, message: errorMessage });
      errorAlertRef.current?.show();
    } finally {
      setStatus(APP_STATUS.IDLE);
    }
  };

  const onPressSignUpLink = () => {
    navigation.navigate('signup');
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.container}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Image source={WalletLogo} style={styles.walletLogo}></Image>
          <View style={styles.headerContainerText}>
            <Text style={styles.loginHeaderText}>Sign in</Text>
            {/* <Text style={styles.loginInfoText}>
              Please login using your aga wallet credentials to continue.
            </Text> */}
          </View>
          <View style={styles.credentialsContainer}>
            <View style={styles.phoneNumberInputContainer}>
              <TextInput
                editable={false}
                startIcon={FlagIcon}
                startIconStyle={styles.flagIconStyle}
                placeholder={`(${COUNTRY_CODE})`}
                containerStyle={styles.countryCode}
                style={styles.contryCodeInput}
                placeholderTextColor={COLORS.BLACK}
              />
              <TextInput
                value={phone}
                onChangeText={onChangePhone}
                containerStyle={styles.phoneNumberInput}
                style={styles.textInput}
                placeholder="Phone number"
              />
            </View>
            {/* {formErrors.phoneNumber.hasError && (
                  <Text style={styles.errorText}>{formErrors.phoneNumber.message}</Text>
                )} */}
            <TextInput
              value={password}
              onChangeText={onChangePassword}
              startIcon={LockIcon}
              placeholder="Password"
              style={styles.textInput}
              secureTextEntry
            />
            {/* {formErrors.password.hasError && (
                  <Text style={styles.errorText}>{formErrors.password.message}</Text>
                )} */}

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('index')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity
          disabled={status === APP_STATUS.LOADING}
          style={[styles.button, status === APP_STATUS.LOADING && styles.disabledLoginBtn]}
          onPress={onPressSubmit}
        >
          {status === APP_STATUS.LOADING ? (
            <ActivityIndicator size="large" color={COLORS.WHITE} />
          ) : (
            <Text style={styles.text}>Sign in</Text>
          )}
        </TouchableOpacity>
        <View style={styles.loginInfoContainer}>
          <Text style={styles.loginInfoText}>Don't have an account?</Text>
          <TouchableOpacity onPress={onPressSignUpLink}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ErrorAlert ref={errorAlertRef} title={error.title} message={error.message} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 'auto',
    display: 'flex',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    alignItems: 'center',
    gap: 20,
  },
  walletLogo: {
    width: '70%',
    height: 90,
    marginTop: 'auto',
    marginBottom: 'auto',
    objectFit: 'contain',
  },
  headerContainerText: {
    width: '100%',
  },
  loginHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: FONT_SIZE.EXTRA_LARGE + 4,
    color: COLORS.BLACK,
  },
  loginInfoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#838383',
  },
  credentialsContainer: {
    display: 'flex',
    gap: 10,
    width: '100%',
    marginBottom: 'auto',
  },
  textInput: {
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
  },
  flagIconStyle: { height: 25, width: 25 },
  phoneNumberInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
  },
  countryCode: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    paddingHorizontal: 20,
  },
  contryCodeInput: {
    paddingHorizontal: 0,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
  },
  errorText: {
    color: COLORS.RED,
    textAlign: 'left',
    marginBottom: 15,
    marginTop: -5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 14,
  },
  loginButtonContainer: {
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: 'auto',
    backgroundColor: COLORS.WHITE,
    paddingBottom: 20,
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
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  loginInfoContainer: {
    display: 'flex',
    backgroundColor: 'none',
    flexDirection: 'row',
    marginTop: 15,
    gap: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledLoginBtn: {
    backgroundColor: COLORS.DISABLED_GRAY,
    elevation: 0,
  },
  signUpText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});

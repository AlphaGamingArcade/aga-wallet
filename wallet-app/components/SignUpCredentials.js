import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, COUNTRY_CODE, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import TextInput from './ui/TextInput';
import LockIcon from '../assets/lock-icon.png';
import FlagIcon from '../assets/flag-icon.png';

export default function SignUpCredentials(props) {
  return (
    <View>
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
          value={props.phone}
          onChangeText={props.onChangePhone}
          containerStyle={styles.phoneNumberInput}
          style={styles.textInput}
          placeholder="Phone number"
        />
      </View>
      {props.formErrors.phoneNumber.hasError && (
        <Text style={styles.errorText}>{props.formErrors.phoneNumber.message}</Text>
      )}
      <TextInput
        value={props.password}
        onChangeText={props.onChangePassword}
        startIcon={LockIcon}
        placeholder="Password"
        style={styles.textInput}
        secureTextEntry
      />
      {props.formErrors.password.hasError && (
        <Text style={styles.errorText}>{props.formErrors.password.message}</Text>
      )}
      <TextInput
        value={props.confirmPassword}
        onChangeText={props.onChangeConfirmPassword}
        startIcon={LockIcon}
        placeholder="Confirm password"
        style={styles.textInput}
        secureTextEntry
      />
      {props.formErrors.confirmPassword.hasError && (
        <Text style={styles.errorText}>{props.formErrors.confirmPassword.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});

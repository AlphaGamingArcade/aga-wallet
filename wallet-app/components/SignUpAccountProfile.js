import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import TextInput from './ui/TextInput';
import UserIcon from '../assets/user-icon.png';
import EmailIcon from '../assets/email-icon.png';

export default function SignUpAccountProfile(props) {
  return (
    <View>
      <TextInput
        value={props.firstName}
        onChangeText={props.onChangeFirstName}
        startIcon={UserIcon}
        placeholder="First Name"
        styles={styles.textInput}
      />
      {props.formErrors.firstName.hasError && (
        <Text style={styles.errorText}>{props.formErrors.firstName.message}</Text>
      )}
      <TextInput
        value={props.lastName}
        onChangeText={props.onChangeLastName}
        startIcon={UserIcon}
        placeholder="Last Name"
        styles={styles.textInput}
      />
      {props.formErrors.lastName.hasError && (
        <Text style={styles.errorText}>{props.formErrors.lastName.message}</Text>
      )}
      <TextInput
        value={props.email}
        onChangeText={props.onChangeEmail}
        startIcon={EmailIcon}
        placeholder="Email Address"
        styles={styles.textInput}
      />
      {props.formErrors.email.hasError && (
        <Text style={styles.errorText}>{props.formErrors.email.message}</Text>
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
  errorText: {
    color: COLORS.RED,
    textAlign: 'left',
    marginBottom: 15,
    marginTop: -5,
  },
});

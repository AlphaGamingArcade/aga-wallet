import React, { forwardRef, useRef } from 'react';
import { View, Image, TextInput as RNInput, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../utils/app_constants';

const TextInput = forwardRef(function MyInput(props, ref) {
  const containerInputRef = useRef(null);

  const setBorderColor = (color) => {
    if (containerInputRef.current) {
      containerInputRef.current.setNativeProps({
        style: { borderColor: color },
      });
    }
  };

  return (
    <View ref={containerInputRef} style={[styles.inputContainer, props.containerStyle]}>
      {props.startIcon && (
        <Image source={props.startIcon} style={[styles.icon, props.startIconStyle]} />
      )}
      <RNInput
        editable={props.editable}
        ref={ref}
        onFocus={() => setBorderColor(COLORS.BORDER_GRAY)}
        placeholderTextColor={props.placeholderTextColor || COLORS.DARK_GRAY}
        onBlur={() => setBorderColor(COLORS.TRANSPARENT)}
        placeholder={props.placeholder}
        value={props.value}
        secureTextEntry={props?.secureTextEntry ?? false}
        onChangeText={props.onChangeText}
        style={[styles.input, props.style]}
      />
      {props.endIcon && <Image source={props.endIcon} style={styles.icon} />}
    </View>
  );
});

export default TextInput;

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 12,
    backgroundColor: COLORS.LIGHT_GRAY,
    width: '100%',
    height: 55,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.TRANSPARENT,
    borderRadius: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: 58,
    padding: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
  },
});

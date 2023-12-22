import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../utils/app_constants';

const Button = forwardRef((props, ref) => {
  return (
    <View style={[styles.buttonContainer, props.containerStyle]}>
      <TouchableOpacity
        ref={ref}
        style={[styles.button, props.buttonStyle]}
        onPress={props.onPress}
      >
        <Image source={props.icon} style={[styles.icon, props.iconStyle]} />
        <Text style={[styles.label, props.label]}>{props.label}</Text>
      </TouchableOpacity>
      <Text style={[styles.bottomLabel, props.bottomLabelStyle]}>{props.bottomLabel}</Text>
    </View>
  );
});

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 21,
    width: 21,
    marginTop: 15,
  },
  bottomLabel: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.DARK_GRAY,
    fontSize: 12,
  },
});

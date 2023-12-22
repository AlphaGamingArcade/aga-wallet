import React, { useRef } from 'react';
import LeftIcon from '../assets/arrow-left-gray.png';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';

export default function ProfileOption({ option, navigation, onClose }) {
  const closeDrawerRef = useRef(null);
  const onPressOption = async () => {
    if (option.name == 'Log out') {
      closeDrawerRef.current?.close();
      try {
        onClose();
        const keys = ['@AgaWallet_USER', '@AgaWallet_WALLETS', '@AgaWallet_TOKEN'];
        await AsyncStorage.multiRemove(keys);
        navigation.navigate('signin');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.optionsContainer} onPress={onPressOption}>
      <View style={styles.optionInfo}>
        <Image source={option.icon} style={styles.icon} />
        <Text style={[styles.optionName, option.name == 'Log out' ? styles.logOut : null]}>
          {option.name}
        </Text>
      </View>
      <Image source={LeftIcon} style={styles.leftIcon} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // backgroundColor: COLORS.PRIMARY,
  },
  optionInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionName: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR + 2,
  },
  icon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  leftIcon: {
    width: 8,
    height: 12,
    marginRight: 10,
  },
  logOut: {
    color: COLORS.PRIMARY,
  },
});

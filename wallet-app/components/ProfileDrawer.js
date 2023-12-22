import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import ProfileOption from './ProfileOption';
import SettingsIcon from '../assets/settings-profile-icon.png';
import InfoIcon from '../assets/info-circle.png';
import LogoutIcon from '../assets/logout-icon.png';
import AgaLogo from '../assets/logo.png';
import { useUser } from '../services/store/user/userContext';

export default function ProfileDrawer({ navigation, onClose }) {
  const userContext = useUser();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <View style={styles.circle}>
          <Text style={styles.profileIcon}>{(userContext?.user?.first_name ?? '').charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userContext?.user?.first_name ?? ''}</Text>
          <Text style={styles.profilePhoneNumber}>{userContext?.user?.phone_number ?? ''}</Text>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.optionsContainer}
      >
        <ProfileOption
          option={{ name: 'Settings', icon: SettingsIcon, navigate: 'settings' }}
          navigation={navigation}
        />
        <ProfileOption
          option={{ name: 'About Wallet', icon: InfoIcon, navigate: 'about' }}
          navigation={navigation}
        />
        <ProfileOption
          option={{ name: 'Log out', icon: LogoutIcon, navigate: 'signin' }}
          navigation={navigation}
          onClose={onClose}
        />
      </ScrollView>
      <View style={styles.profileFooter}>
        <Image source={AgaLogo} style={styles.agaLogo}></Image>
        <Text style={styles.versionText}>Version 1.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: 23,
  },
  container: {
    flex: 1,
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 55,
  },
  circle: {
    height: 100,
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#000',
    borderRadius: 100,
    backgroundColor: COLORS.PRIMARY,
  },
  profileIcon: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textTransform: 'capitalize',
    fontSize: 60,
    lineHeight: 75,
    height: 65,
    display: 'flex',
    textAlign: 'center',
    alignSelf: 'center',
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: -5,
  },
  profileName: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: FONT_SIZE.LARGE + 10,
    textTransform: 'capitalize',
  },
  profilePhoneNumber: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: FONT_SIZE.REGULAR + 2,
  },
  optionsContainer: {
    paddingVertical: 15,
  },
  profileFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: -25,
  },
  agaLogo: {
    width: 90,
    height: 90,
    objectFit: 'contain',
  },
  versionText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.BORDER_GRAY,
  },
});

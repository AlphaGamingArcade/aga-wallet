import LeftIcon from '../assets/arrow-left-gray.png';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import { useAuth } from '../services/store/auth/AuthContext';
import { useUser } from '../services/store/user/userContext';

export default function ProfileOption({ option, onClose }) {
  const { signOut } = useAuth();
  const { clearUser } = useUser();

  const onPressOption = async () => {
    if (option.name == 'Log out') {
      try {
        clearUser();
        signOut();
        onClose();
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

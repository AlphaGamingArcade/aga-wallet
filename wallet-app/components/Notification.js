import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TurboModuleRegistry,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReceiveIcon from '../assets/receive-icon-white.png';
import UpdatesIcon from '../assets/notification-icon-white.png';
import SendIcon from '../assets/send-icon-white.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, OPTION_TYPE } from '../utils/app_constants';
import NotificationModal from './NotificationModal';

const notificationInfo = {
  receive: {
    notificationImg: ReceiveIcon,
  },
  send: {
    notificationImg: SendIcon,
  },
  update: {
    notificationImg: UpdatesIcon,
  },
};

export default function Notification() {
  const option = OPTION_TYPE.RECEIVE;

  const openModal = useRef(null);
  const handleClick = () => {
    openModal?.current?.open();
  };

  return (
    <View style={styles.container}>
      <View style={styles.notificationContainer}>
        <LinearGradient
          colors={[COLORS.PRIMARY, 'rgba(0, 0, 0, 0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.circle}
        >
          <Image source={notificationInfo[option].notificationImg} style={styles.optionIcon} />
        </LinearGradient>
        <View style={styles.notificationMessegeInfo}>
          <Text style={styles.notificationMessege}>You received money from John Doe</Text>
          <Text style={styles.notificationMessegeTime}>12 minutes ago</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleClick}>
        <Text style={styles.notificationButtonText}>...</Text>
      </TouchableOpacity>
      <View style={styles.notificationModal}>
        <NotificationModal ref={openModal}>
          <Text style={styles.modalHeaderText}>Recieved Money</Text>
          <Text style={styles.modalDateText}>December 18, 2023 3:47 PM </Text>
          <Text style={styles.modalContentText}>
            You have received a $1000 deposit from John Doe. Your new account balance is $50,000 as
            of 12-18-23 at 3:47 PM. Transaction Number: 1234345. Thank you for using our services!
          </Text>
        </NotificationModal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 11,
    height: 100,
  },
  notificationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 25,
    height: 25,
  },
  notificationMessegeContainer: {
    flex: 1,
    marginTop: 10,
  },
  notificationAllMessege: {
    marginTop: 15,
  },
  notificationMessegeInfo: {
    flex: 1,
  },
  notificationMessege: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
  },
  notificationMessegeTime: {
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZE.SMALL,
  },
  notificationButtonText: {
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZE.LARGE,
  },
  notificationMessegeAll: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
  },
  notificationContent: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'red',
  },
  notificationModal: {
    position: 'absolute',
  },
  modalHeaderText: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: FONT_SIZE.LARGE,
  },
  modalDateText: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: FONT_SIZE.REGULAR,
  },
  modalContentText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
    textAlign: 'justify',
    lineHeight: 23,
    marginTop: 20,
  },
});

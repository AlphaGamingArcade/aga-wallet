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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReceiveIcon from '../assets/receive-icon-white.png';
import UpdatesIcon from '../assets/notification-icon-white.png';
import SendIcon from '../assets/send-icon-white.png';
import DeleteIcon from '../assets/delete-icon.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, OPTION_TYPE } from '../utils/app_constants';
import NotificationModal from './NotificationModal';
import TestingModal from './Modal';
import { getDate } from '../utils/formatter';

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

export default function Notification({data}) {
  const [isViewed , setisViewed ] = useState(data.is_viewed)
  const date = getDate(data.created_at)
  const openModal = useRef(null);
  const clickOpenModal = () => {
    openModal?.current?.open();
    setisViewed(true)
  };

  const clickCloseModal = () => {
    openModal?.current?.close();
  };

  return (
    <TouchableOpacity onPress={clickOpenModal}>
      <View style={[styles.container , !isViewed ? styles.activeIndicator:'']}>
        <View style={styles.notificationContainer }>
          <LinearGradient
            colors={[COLORS.PRIMARY, 'rgba(0, 0, 0, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.circle}
          >
            <Image source={notificationInfo[data.type].notificationImg} style={styles.optionIcon} />
          </LinearGradient>
          <View style={styles.notificationMessegeInfo}>
            <Text style={styles.notificationMessege}>{data.type}</Text>

            <Text style={styles.notificationMessegeTime}>12 minutes ago</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={DeleteIcon} style={styles.deleteIcon} />
        </TouchableOpacity>
        <View style={styles.notificationModal}>
          <NotificationModal ref={openModal}>
            <Text style={styles.modalHeaderText}>Recieved Money</Text>
            <Text style={styles.modalDateText}>{date}</Text>
            <Text style={styles.modalContentText}>
            {data.source}
              {/* You have received a $1000 deposit from John Doe. Your new account balance is $50,000
              as of 12-18-23 at 3:47 PM. Transaction Number: 1234345. Thank you for using our
              services! */}
            </Text>
            <TouchableOpacity onPress={clickCloseModal} style={styles.closeModalButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </NotificationModal>
        </View>
      </View>
    </TouchableOpacity>
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
    height: 70,
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
  deleteIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
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
  closeModalButton: {
    backgroundColor: COLORS.PRIMARY,
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
  closeText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.WHITE,
  },
  activeIndicator:{
    borderWidth:1,
    borderColor:COLORS.PRIMARY
  }

});

{
  /* You have sent a $1000 deposit to John Doe. Your new account balance is $50,000 as of 12-18-23 at 3:47 PM. Transaction Number: 1234345. */
}

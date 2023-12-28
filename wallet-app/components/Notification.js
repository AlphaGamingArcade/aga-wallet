import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReceiveIcon from '../assets/receive-icon-white.png';
import UpdatesIcon from '../assets/notification-icon-white.png';
import SendIcon from '../assets/send-icon-white.png';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
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

export default function Notification({ data }) {
  const [isViewed, setIsViewed] = useState(data.is_viewed);
  const openModal = useRef(null);

  const clickOpenModal = () => {
    setIsViewed(true);
    openModal?.current?.open();
  };

  const clickCloseModal = () => {
    openModal?.current?.close();
  };

  const date = new Date(data.created_at).toLocaleDateString();

  return (
    <TouchableOpacity onPress={clickOpenModal}>
      <View style={styles.container}>
        <View style={styles.notificationContainer}>
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
          </View>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.optionsButton}>
            <Text>...</Text>
          </TouchableOpacity>
          <View style={styles.optionSubContainer}>
            <TouchableOpacity>
              <Text style={styles.optionText}>Mark as read</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <NotificationModal ref={openModal}>
          <Text style={styles.modalHeaderText}>Received Money</Text>
          <Text style={styles.modalDateText}>{date}</Text>
          <Text style={styles.modalContentText}>{data.source}</Text>
          <TouchableOpacity onPress={clickCloseModal} style={styles.closeModalButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </NotificationModal>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  optionIcon: {
    width: 25,
    height: 25,
  },
  notificationMessegeInfo: {
    flex: 1,
  },
  notificationMessege: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
  },
  optionContainer: {
    position: 'relative',
    marginLeft: 'auto',
    overflow: 'visible',
  },
  optionsButton: {
    fontSize: FONT_SIZE.LARGE + 10,
  },
  optionSubContainer: {
    position: 'absolute',
    width: 100,
    backgroundColor: COLORS.PRIMARY,
    elevation: 5,
    zIndex: 1,
    marginLeft: -85,
    marginTop: 20,
  },
  optionText: {
    padding: 10,
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
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 15,
    padding: 10,
  },
  closeText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.WHITE,
  },
});

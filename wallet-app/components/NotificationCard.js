import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReceiveIcon from '../assets/receive-icon-white.png';
import UpdatesIcon from '../assets/notification-icon-white.png';
import SendIcon from '../assets/send-icon-white.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '../utils/app_constants';
import NotificationModal from './NotificationModal';
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

export default function NotificationCard({ data }) {
  const [isViewed, setIsViewed] = useState(data.is_viewed);

  const openModal = useRef(null);

  const clickOpenModal = () => {
    setIsViewed(true);
    openModal?.current?.open();
  };

  const clickCloseModal = () => {
    openModal?.current?.close();
  };

  const date = getDate(data.created_at);

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
            <Text style={[styles.notificationMessege, !isViewed && styles.active]}>
              {data.type}
            </Text>
          </View>
        </View>
        <View style={styles.mainOptionContainer}>
          <TouchableOpacity>
            <Text style={styles.optionsButton}>...</Text>
          </TouchableOpacity>
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginBottom: 5,
    position: 'relative',
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
  optionsButton: {
    fontSize: FONT_SIZE.LARGE + 10,
  },
  mainOptionContainer: {
    position: 'relative',
  },
  subOptionContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    marginTop: 40,
    marginLeft: -50,
    width: 100,
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
  active: {
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
  },
});

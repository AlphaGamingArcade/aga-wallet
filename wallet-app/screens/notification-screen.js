import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import BackIcon from '../assets/arrow-left-v2.png';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import Notification from '../components/Notification';
import { genericGetRequest } from '../services/api/genericGetRequest';
const ITEMS_PER_PAGE = 6;

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const backButtonHandler = () => {
    navigation.goBack();
  };

  const fetchData = async (page) => {
    try {
      const response = await genericGetRequest(`users/notification?page=${page}`);
      setNotifications((prevNotifications) => [...prevNotifications, ...response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={backButtonHandler}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.notificationText}>Notifications</Text>
      </View>
      <Text style={styles.notificationTextRecent}>Recent</Text>
      <ScrollView
        contentContainerStyle={styles.recentContainer}
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleLoadMore}
      >
        {notifications.map((notification) => (
          <Notification key={notification.user_id} data={notification} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  notificationText: {
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    fontSize: 26,
  },
  mainContainer: {
    flex: 1,
  },
  notificationTextRecent: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: FONT_SIZE.LARGE,
    color: COLORS.PRIMARY,
    marginTop: 40,
  },
});

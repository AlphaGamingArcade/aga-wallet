import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BackIcon from '../assets/arrow-left-v2.png';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import NotificationCard from '../components/NotificationCard';
import { genericGetRequest } from '../services/api/genericGetRequest';
import NotificationTab from '../components/NotificationTab';
import NotificationContext from '../services/store/notificationAssets/notificationAssetsContext';

export default function NotificationScreen({ navigation }) {
  const { notifications , fetchDatas } = useContext(NotificationContext);
  
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const tabNotifications = [
    notifications.filter((data) => data.type === 'send'),
    notifications.filter((data) => data.type === 'receive'),
    notifications.filter((data) => data.type === 'update'),
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'send':
        return <NotificationTab notifications={tabNotifications[index]} />;
      case 'receive':
        return <NotificationTab notifications={tabNotifications[index]} />;
      case 'update':
        return <NotificationTab notifications={tabNotifications[index]} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBar.indicatorStyle}
      style={styles.tabBar.tabBarStyle}
      labelStyle={styles.tabBar.labelStyle}
      activeColor="#FFF"
    />
  );

  const [routes] = React.useState([
    { key: 'send', title: 'Send' },
    { key: 'receive', title: 'Receive' },
    { key: 'update', title: 'Update' },
  ]);

  const handleChangeTab = (newIndex) => {
    setIndex(newIndex);
    let type = ''
    index == 0 ? type = 'SEND_ASSETS' : index == 1 ? type = 'RECEIVE_ASSETS' : type = 'UPDATE_ASSETS' ;
    fetchDatas(type)
  };

  const handleBackButton = () => {
    navigation.goBack();
  };

  useEffect(() => {
    console.log('This isload');
    fetchDatas('send');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackButton}>
          <Image source={BackIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.notificationText}>Notifications</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleChangeTab}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
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
    marginBottom: 37,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  notificationText: {
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    fontSize: 26,
  },
  tabBar: {
    tabBarStyle: {
      borderWidth: 0.5,
      backgroundColor: COLORS.WHITE,
      marginBottom: 10,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      overflow: 'hidden',
      height: 40,
    },
    indicatorStyle: {
      height: '100%',
      backgroundColor: COLORS.PRIMARY,
    },
    labelStyle: {
      marginTop: -5,
      color: COLORS.BLACK,
    },
  },
});

//   const [containerWidth, setContainerWidth] = useState(0);
//   const [isActive , setIsActive] = useState(0);
//   const [notif , setNotif] = useState('send')
//   const [notifications, setNotifications] = useState([]);
//   const activeX = useRef(new Animated.Value(0)).current;

//   const fetchData = async () => {
//     try {
//       const response = await genericGetRequest(`users/notification`);
//       setNotifications(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(()=>{
//     fetchData()
//   }, [])

//   const backButtonHandler = () => {
//     navigation.goBack();
//   };

//   const onMove = (index) => {
//     return () => {
//       const buttonWidth = containerWidth / 3;
//       const position = Math.floor(index * buttonWidth);

//       Animated.timing(activeX, {
//         toValue: position,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();

//       const timeout = setTimeout(()=>{
//         setIsActive(index)
//         clearTimeout(timeout)
//       },200)
//       const type = index === 0 ? 'send' : index === 1 ? 'receive' : 'update';
//       setNotif(type)
//     };
//   };

//   const onContainerLayout = (event) => {
//     const { width } = event.nativeEvent.layout;
//     setContainerWidth(width);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Pressable onPress={backButtonHandler}>
//           <Image source={BackIcon} style={styles.backIcon} />
//         </Pressable>
//         <Text style={styles.notificationText}>Notifications</Text>
//       </View>
//       <View style={styles.navigationContainer} onLayout={onContainerLayout}>
//         <Animated.View style={[styles.activeButton, { transform: [{ translateX: activeX }] }]} />
//         <Pressable onPress={onMove(0)} style={[styles.button]}>
//           <Text style={[styles.navigationText , isActive == 0 ? styles.activeText : '']}>Send</Text>
//         </Pressable>
//         <Pressable onPress={onMove(1)} style={[styles.button, styles.receiveButton]}>
//           <Text style={[styles.navigationText , isActive == 1 ? styles.activeText : '']}>Receive</Text>
//         </Pressable>
//         <Pressable onPress={onMove(2)} style={styles.button}>
//           <Text style={[styles.navigationText , isActive == 2 ? styles.activeText : '']}>Update</Text>
//         </Pressable>
//       </View>

//       <ScrollView
//         scrollEventThrottle={16}
//         contentContainerStyle={styles.recentContainer}
//         style={styles.mainContainer}
//         showsVerticalScrollIndicator={false}
//         // onMomentumScrollEnd={handleLoadMore}
//       >
//         {notifications.map((notification) => {
//         return notification.type === notif ? (
//           <Notification key={notification.user_id} data={notification} />
//         ) : null;
//       })}

//       </ScrollView>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 40,
//   },
//   backIcon: {
//     width: 25,
//     height: 25,
//   },
//   notificationText: {
//     fontFamily: FONT_FAMILY.POPPINS_BOLD,
//     fontSize: 26,
//   },
//   mainContainer: {
//     flex: 1,
//     marginTop:34,
//   },
//   navigationContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf:'center',
//     borderWidth: 0.8,
//     borderRadius: 5,
//     overflow: 'hidden',
//     position: 'relative',
//     marginTop:27,
//     width:'90%',

//   },
//   button: {
//     flex: 1,
//     padding: 10,
//     paddingTop:5,
//     paddingBottom:5,
//     display: 'flex',
//     alignItems: 'center',
//   },
//   activeButton: {
//     backgroundColor: COLORS.PRIMARY,
//     width: '33.3%', //'33.9%'
//     height: 500,
//     position: 'absolute',
//     left: 0,
//   },
//   activeText: {
//     color: COLORS.WHITE,
//   },

//   receiveButton: {
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//   },
//   navigationText: {
//     fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
//     fontSize: FONT_SIZE.REGULAR,
//   },
// });

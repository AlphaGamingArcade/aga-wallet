// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   SafeAreaView,
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Pressable,
//   Animated,
// } from 'react-native';

// import BackIcon from '../assets/arrow-left-v2.png';
// import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
// import Notification from '../components/Notification';
// import { genericGetRequest } from '../services/api/genericGetRequest';

// export default function NotificationScreen({ navigation }) {
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [isActive, setIsActive] = useState(0);
//   const [notif, setNotif] = useState('send');
//   const [notifications, setNotifications] = useState([]);
//   const activeX = useRef(new Animated.Value(0)).current;

  // const fetchData = useCallback(async () => {
  //   try {
  //     const response = await genericGetRequest(`users/notification`);
  //     setNotifications(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },[])
  

  // useEffect(() => {
  //   fetchData();
  // }, []);

//   const backButtonHandler = () => {
//     navigation.goBack();
//   };


//   const onMove = (index) => {
//     console.log("Rendered")
//     return () => {
//       const buttonWidth = containerWidth / 3;
//       const position = Math.floor(index * buttonWidth);

//       Animated.timing(activeX, {
//         toValue: position,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();

//       const timeout = setTimeout(() => {
//         setIsActive(index);
//         clearTimeout(timeout);
//       }, 200);
//       console.log("Rendered 2")
//       const type = index === 0 ? 'send' : index === 1 ? 'receive' : 'update';
//       setNotif(type);
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
//           {/* Replace with your actual image source */}
//           <Image source={BackIcon} style={styles.backIcon} />
//         </Pressable>
//         <Text style={styles.notificationText}>Notifications</Text>
//       </View>
//       <View style={styles.navigationContainer} onLayout={onContainerLayout}>
//         <Animated.View style={[styles.activeButton, { transform: [{ translateX: activeX }] }]} />
//         <Pressable onPress={onMove(0)} style={[styles.button]}>
//           <Text style={[styles.navigationText, isActive == 0 ? styles.activeText : '']}>Send</Text>
//         </Pressable>
//         <Pressable onPress={onMove(1)} style={[styles.button, styles.receiveButton]}>
//           <Text style={[styles.navigationText, isActive == 1 ? styles.activeText : '']}>
//             Receive
//           </Text>
//         </Pressable>
//         <Pressable onPress={onMove(2)} style={styles.button}>
//           <Text style={[styles.navigationText, isActive == 2 ? styles.activeText : '']}>
//             Update
//           </Text>
//         </Pressable>
//       </View>

//       <ScrollView
//         scrollEventThrottle={16}
//         contentContainerStyle={styles.recentContainer}
//         style={styles.mainContainer}
//         showsVerticalScrollIndicator={false}
//         // onMomentumScrollEnd={handleLoadMore}
//       >

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
//     marginTop: 34,
//   },
//   navigationContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     borderWidth: 0.8,
//     borderRadius: 5,
//     overflow: 'hidden',
//     position: 'relative',
//     marginTop: 27,
//     width: '90%',
//   },
//   button: {
//     flex: 1,
//     padding: 10,
//     paddingTop: 5,
//     paddingBottom: 5,
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
import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { genericGetRequest } from '../services/api/genericGetRequest';
import Notification from '../components/Notification';

const FirstRoute = () => {
    const [notifications, setNotifications] = React.useState([]);
      const [notif, setNotif] = React.useState('send');
    const fetchData = React.useCallback(async () => {
    try {
      const response = await genericGetRequest(`users/notification`);
      console.log(response.data)
      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    }
  },[])
  

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} >
         {notifications.map((notification) => {
          return notification.type === "recieve " && (
            <Notification key={notification.user_id} data={notification} />
          );
        })}
    </View>
  );
}

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  StatusBar,
  Animated
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../utils/app_constants';
import ManageAssetsImage from '../assets/manage-assets-onboarding.png';
import TransferMoneyImage from '../assets/transfer-money-onboarding.png';
import RealtimeUpdatesImage from '../assets/realtime-updates-onboarding.png';
import { useNewUser } from '../services/store/newUser/NewUserContext';

const OnboardingPageOne = () => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);


  return (
    <Animated.View style={[styles.pageContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={TransferMoneyImage} style={styles.pageImage} resizeMode="contain" />
      </View>
      <Text style={styles.pageHeaderText}>Effortlessly transfer assets</Text>
      <Text style={styles.pageSubHeaderText}>
        With our user-friendly interface, effortlessly transfer money—send and receive funds with
        speed and security.
      </Text>
    </Animated.View>
  );
};

const OnboardingPageTwo = (props) => {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);


  return (
    <Animated.View style={[styles.pageContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={RealtimeUpdatesImage} style={styles.pageImage} resizeMode="contain" />
      </View>
      <Text style={styles.pageHeaderText}>Stay ahead with real-time updates</Text>
      <Text style={styles.pageSubHeaderText}>
        Enjoy instant insights into market changes and asset movements, providing you with the
        information you need, when you need it.
      </Text>
    </Animated.View>
  );
};

const OnboardingPageThree = () => {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={[styles.pageContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={ManageAssetsImage} style={styles.pageImage} resizeMode="contain" />
      </View>
      <Text style={styles.pageHeaderText}>Seamlessly manage your assets</Text>
      <Text style={styles.pageSubHeaderText}>
        Effortlessly take charge of your financial portfolio with our Crypto Wallet App!
      </Text>
    </Animated.View>
  );
};

const renderScene = SceneMap({
  first: OnboardingPageOne,
  second: OnboardingPageTwo,
  third: OnboardingPageThree,
});

export default function OnboardingScreen() {
  const layout = useWindowDimensions();
  const { updateNewUser } = useNewUser();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
    { key: 'third', title: 'Third' },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderTabBarItem={() => {
        return <View style={styles.tabBarItem} />;
      }}
      indicatorContainerStyle={styles.tabBarIndicatorContainer}
      indicatorStyle={styles.tabBarIndicator}
      style={styles.tabBarStyle}
    />
  );

  const onNext = () => {
    if (index <= 1) {
      setIndex(index + 1);
    } else {
      updateNewUser(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipActionContainer}>
        <TouchableOpacity onPress={() => updateNewUser(false)}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <TabView
        lazy
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        tabBarPosition="bottom"
      />
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{index <= 1 ? 'Continue' : 'Get Started'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skipActionContainer: {
    marginTop: StatusBar.currentHeight + 30,
    display: 'flex',
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  skipText: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
  },
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  pageImage: {
    width: '100%',
    height: 250,
  },
  pageHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: FONT_SIZE.LARGE,
    width: '70%',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  pageSubHeaderText: {
    color: COLORS.GRAY,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: FONT_SIZE.REGULAR,
    width: '80%',
    textAlign: 'center',
    lineHeight: 25,
    paddingVertical: 15,
  },
  tabBarItem: {
    height: 6,
    borderWidth: 0.4,
    borderRadius: 5,
    borderColor: COLORS.PRIMARY,
    width: '100%',
  },
  tabBarIndicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIndicator: {
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    height: 6,
    borderRadius: 5,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    width: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 55,
  },
  disabledNextBtn: {
    backgroundColor: COLORS.DISABLED_GRAY,
    elevation: 0,
  },
  nextButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  actionBtnContainer: {
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
});

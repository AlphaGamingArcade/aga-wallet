import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import NotificationCard from './NotificationCard';

export default function NotificationTab({ notifications }) {
  return (
    <View style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={styles.recentContainer}
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        // onMomentumScrollEnd={handleLoadMore}
      >
        {notifications.map((notification) => {
            return <NotificationCard key={notification.user_id} data={notification} />;
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
});

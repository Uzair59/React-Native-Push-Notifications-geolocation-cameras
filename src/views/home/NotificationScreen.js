import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NotificationContext} from '../../../App';

const NotificationScreen = () => {
  const {notifications} = useContext(NotificationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📬 Notifications</Text>

      {notifications.length === 0 ? (
        <Text>No notifications received yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 36, marginTop: 30},
  heading: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {fontSize: 16, fontWeight: '600'},
  time: {fontSize: 12, color: 'gray', marginTop: 5},
});

export default NotificationScreen;

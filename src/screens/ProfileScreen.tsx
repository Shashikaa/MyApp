import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseinit';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { BatteryModule } = NativeModules;

interface UserData {
  profilePicture?: string;
  name?: string;
  email?: string;
}

type RootStackParamList = {
  Login: undefined;
  Profile: { email: string };
  // Add other screens as needed
};

type ProfileScreenRouteProp = RouteProp<{ Profile: { email: string } }, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProfileScreenRouteProp>();
  const { email } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (email) {
          const userQuery = query(collection(db, 'Users'), where('email', '==', email));
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data() as UserData;
            setUser(userDoc);
          } else {
            setError('User not found');
          }
        } else {
          setError('Email is not available');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    const fetchBatteryLevel = async () => {
      try {
        const level = await BatteryModule.getBatteryLevel();
        setBatteryLevel(level);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
    fetchBatteryLevel();
  }, [email]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }}
            style={styles.profilePicture}
          />
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{user.name || 'Name not available'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{user.email || 'Email not available'}</Text>
            </View>
            <View style={styles.infoBox}>
              <View style={styles.batteryContainer}>
                <Icon name="battery" size={40} color="white" />
                <Text style={styles.batteryText}>
                  {batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.text}>No user data available</Text>
        </View>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 18,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#FFD482',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfileScreen;

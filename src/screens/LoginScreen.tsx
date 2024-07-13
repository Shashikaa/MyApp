import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebase/firebaseinit'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

type RootStackParamList = {
  Home: { email: string }; 
  Signup: undefined;
};

type LoginFieldProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const handleLogin = async (
  email: string,
  password: string,
  navigation: NavigationProp<RootStackParamList>
) => {
  if (!email || !password) {
    Alert.alert('Validation Error', 'Email and password are required.');
    return;
  }

  try {
    const usersCollectionRef = collection(db, 'Users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Alert.alert('Login Failed', 'User does not exist.');
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verify password securely
    if (userData.password !== password) {
      Alert.alert('Login Failed', 'Incorrect password.');
      return;
    }

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    navigation.navigate('Home', { email });
  } catch (error: unknown) {
    Alert.alert('Login Failed', (error as Error).message || 'An error occurred.');
  }
};

const LoginField: React.FC<LoginFieldProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
}) => {
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Your Email'
          placeholderTextColor='#C0C0C0'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>

      <View style={[styles.inputContainer, styles.passwordContainer]}>
        <TextInput
          placeholder='Password'
          placeholderTextColor='#C0C0C0'
          style={[styles.input, { flex: 1 }]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Icon
          name={showPassword ? 'eye-off' : 'eye'}
          color="white"
          type='feather'
          size={15}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <Text style={styles.forgotPassword}>
        Forget Password?
      </Text>
    </View>
  );
};

const LogInButton: React.FC<{ email: string; password: string }> = ({ email, password }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handleLogin(email, password, navigation)}>
      <View style={styles.loginButton}>
        <Text style={styles.loginButtonText}>
          Sign In
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SignUpButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.signUpContainer}>
      <Text style={styles.signUpText}>
        Don't have an account?{' '}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpLink}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        navigation.navigate('Home', { email: JSON.parse(user).email });
      }
    };

    checkUserSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='never'>
        <Text style={styles.title}>My App</Text>
        <LoginField
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <LogInButton email={email} password={password} />
        <SignUpButton />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
  },
  title: {
    fontSize: 25,
    color: 'white',
    fontWeight: '600',
    marginTop: 150,
    marginLeft: 150,
  },
  inputContainer: {
    width: 370,
    height: 60,
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    marginTop: 50,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 15,
    color: 'white',
    width: 300,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: '#FFD482',
    fontSize: 14,
    marginLeft: 260,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: 370,
    height: 60,
    backgroundColor: '#FFD482',
    borderRadius: 10,
    marginTop: 80,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    marginTop: 230,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: 14,
  },
  signUpLink: {
    color: '#FFD482',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

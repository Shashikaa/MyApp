import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseinit'; 

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<any>(); 

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const containsLowercase = (password: string): boolean => /[a-z]/.test(password);
  const containsUppercase = (password: string): boolean => /[A-Z]/.test(password);
  const containsSpecialChar = (password: string): boolean => /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!containsLowercase(password) || !containsUppercase(password) || !containsSpecialChar(password) || password.length < 8) {
      Alert.alert('Error', 'Password does not meet the requirements');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created:', user); // Debugging log

      // Store additional user data in Firestore
      await addDoc(collection(db, 'Users'), {
        email: user.email,
        name: name,
        uid: user.uid,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Error creating user:', error); // Debugging log
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='never'>
        <Text style={styles.headerText}>My App</Text>
        <View>
          <View style={styles.inputContainer}>
            <TextInput 
              placeholder='Name'
              placeholderTextColor='#C0C0C0'
              style={styles.textInput}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              placeholder='Your Email'
              placeholderTextColor='#C0C0C0'
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput 
              placeholder='Password'
              placeholderTextColor='#C0C0C0'
              secureTextEntry={!showPassword}
              style={styles.textInput}
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

          <View style={styles.passwordContainer}>
            <TextInput 
              placeholder='Confirm Password'
              placeholderTextColor='#C0C0C0'
              secureTextEntry={!showPassword}
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Icon 
              name={showPassword ? 'eye-off' : 'eye'}
              color="white"
              type='feather'
              size={15}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>

          <View style={styles.passwordHintContainer}>
            <Icon 
              name={containsLowercase(password) ? 'check' : 'refresh-cw'}
              color="white"
              type='feather'
              size={15}
            />
            <Text style={styles.passwordHintText}>
              One lowercase character
            </Text>
          </View>

          <View style={styles.passwordHintUppercaseContainer}>
            <Icon 
              name={containsUppercase(password) ? 'check' : 'refresh-cw'}
              color="white"
              type='feather'
              size={15}
            />
            <Text style={styles.passwordHintText}>
              One uppercase character
            </Text>
          </View>

          <View style={styles.passwordHintContainer}>
            <Icon 
              name={containsSpecialChar(password) ? 'check' : 'refresh-cw'}
              color="white"
              type='feather'
              size={15}
            />
            <Text style={styles.passwordHintText}>
              One special character
            </Text>
          </View>

          <View style={styles.passwordHintUppercaseContainer}>
            <Icon 
              name={password.length >= 8 ? 'check' : 'refresh-cw'}
              color="white"
              type='feather'
              size={15}
            />
            <Text style={styles.passwordHintText}>
              8 characters minimum
            </Text>
          </View>

          <TouchableOpacity onPress={handleSignUp}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: '600',
    marginTop: 90,
    marginLeft: 150,
  },
  inputContainer: {
    width: 370,
    height: 60,
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 15,
    color: 'white',
    width: 300,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    width: 370,
    height: 60,
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  passwordHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 15,
  },
  passwordHintText: {
    color: 'white',
    fontSize: 11,
    marginLeft: 10,
  },
  passwordHintUppercaseContainer:{
    marginLeft:240,
    marginTop: -15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer: {
    width: 370,
    height: 60,
    backgroundColor: '#FFD482',
    borderRadius: 10,
    marginTop: 40,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    marginTop: 150,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: 15,
  },
  signUpLink: {
    color: '#FFD482',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;

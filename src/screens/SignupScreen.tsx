import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const SignUpField = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = useState('');
  const containsLowercase = (password) => /[a-z]/.test(password);
  
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Name'
          placeholderTextColor='#C0C0C0'
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Your Email'
          placeholderTextColor='#C0C0C0'
          style={styles.textInput}
        />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput 
          placeholder='Password'
          placeholderTextColor='#C0C0C0'
          secureTextEntry={!showPassword}
          style={styles.textInput}
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
          name={containsLowercase(password) ? 'check' : 'refresh-cw'}
          color="white"
          type='feather'
          size={15}
        />
        <Text style={styles.passwordHintText}>
          One Uppercase character
        </Text>
      </View>

      <View style={styles.passwordHintContainer}>
        <Icon 
          name={containsLowercase(password) ? 'check' : 'refresh-cw'}
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
          name={containsLowercase(password) ? 'check' : 'refresh-cw'}
          color="white"
          type='feather'
          size={15}
        />
        <Text style={styles.passwordHintText}>
          8 charactern minimum
        </Text>
      </View>
    
    </View>
  );
};

const SignInButton = () => {
  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.buttonText}>
        Sign Up
      </Text>
    </View>
  );
};

const LogInButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.signUpContainer}>
      <Text style={styles.signUpText}>
        Have an account?{' '}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpLink}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='never'>
        <Text style={styles.headerText}>My App</Text>
        <SignUpField />
        <SignInButton />
        <LogInButton />
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
    marginTop: 80,
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
    marginTop: 140,
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

export default SignupScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';  
import SignupScreen from '../screens/SignupScreen'; 
import HomePage from '../screens/HomePage';
import ProfileScreen from '../screens/ProfileScreen';
import SearchResultsScr from '../screens/SearchResultsScr';
import BatteryLevelScreen from '../screens/BatteryLevelScreen'; // Import the BatteryLevelScreen

// Define a type for the stack navigator
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  SearchResults: { searchResults: any[] };
  Battery: undefined; // Add Battery screen type
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // Set the initial route here
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScr} />
        <Stack.Screen name="Battery" component={BatteryLevelScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

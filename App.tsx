import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import 'react-native-gesture-handler';

// Splash Screen Component
const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Welcome to MyApp</Text>
    </View>
  );
};

function App(): JSX.Element {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <View style={styles.container}>
      {isSplashVisible ? <SplashScreen /> : <AppNavigation />}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A', // Adjust the background color as needed
  },
  splashText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Adjust the text color as needed
  },
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A', // Adjust the background color as needed
  },
});

export default App;

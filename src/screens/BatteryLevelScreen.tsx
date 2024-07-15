import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { BatteryModule } = NativeModules;

const BatteryLevelScreen: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const fetchBatteryLevel = async () => {
    try {
      const level = await BatteryModule.getBatteryLevel();
      setBatteryLevel(level);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBatteryLevel();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Battery level: {batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}
      </Text>
      <Button
        title="Refresh Battery Level"
        onPress={fetchBatteryLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BatteryLevelScreen;

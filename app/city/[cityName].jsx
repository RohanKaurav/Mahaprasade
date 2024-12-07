import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const { cityName } = useLocalSearchParams();
  let validCities = ["mumbai", "kharagpur", "delhi", "bangalore"];
  const [isCurrentCityValid, setCurrentCityValid] = useState(validCities.includes(cityName));
  return (
    <View>
      <View className='h-screen bg-blue-500 justify-center items-center'>
        {isCurrentCityValid ? <Text>
            Welcome to the {cityName}
        </Text> : <Text>
            Invalid city name
        </Text>}
      </View>
    </View>
  );
}

import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import cityData from "../../data/city.json";

export default function HomeScreen() {
  const { cityName } = useLocalSearchParams();
  const [prasadamProviders, setPrasadamProviders] = useState(getPrasadamProviders(cityName));

  function getPrasadamProviders(cityName) {
    if (!cityData[cityName]) {
      return [];
    }
    return cityData[cityName];
  }
  
  return (
    <View>
      <View className='h-screen bg-blue-500 justify-center items-center'>
        {prasadamProviders.length > 0 ? prasadamProviders.map((prasadamProvider) =>{
          return (
            <View className="m-5">
              <Text>{prasadamProvider.name}</Text>
              <Text>{prasadamProvider.address}</Text>
              <Text>{prasadamProvider.phone}</Text>
            </View>
          )
        }) : <Text>Hare Krishna! Sorry Currently we don't have this city's data</Text>}
      </View>
    </View>
  );
}

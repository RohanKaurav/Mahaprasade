import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  // const { city } = useLocalSearchParams();
  return (
    <View>
      <View className='h-screen bg-blue-500 justify-center items-center'>
        <Text>
            Welcome to the dummy file!
        </Text>
      </View>
    </View>
  );
}

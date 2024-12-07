import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [city, setCity] = useState('');
  function handleCityChange(city) {
    setCity(city);
  }
  return (
    <View>
      <View className='h-screen bg-red-500 justify-center items-center'>
      <Input>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField onChangeText={handleCityChange} value={city} placeholder="Search..." />
      </Input>
      <Button onPress={() => {
          router.navigate(`/city/${city}`)
        }} size="md" variant="solid" action="primary" className='m-5'>
        <ButtonText>Go to {city}</ButtonText>
      </Button>

      </View>
    </View>
  );
}

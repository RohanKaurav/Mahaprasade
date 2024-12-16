import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';


import HomeSearch from "../components/HomeSearch"


export default function HomeScreen() {
 
  return (
      <HomeSearch/>
  );
}

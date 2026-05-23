import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTheme } from '../constants/AppTheme';


const SidebarMenu = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

const sidebarWidth = screenWidth > 768
  ? screenWidth * 0.2 
  : screenWidth * 0.6; 
  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={() => setSidebarVisible(true)} className="p-0">
      <Text style={{ fontSize: 24, color: AppTheme.colors.textPrimary }}>☰</Text>
</Pressable>

      <Modal
        visible={isSidebarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            flexDirection: 'row',
          }}
          activeOpacity={1}
          onPressOut={() => setSidebarVisible(false)}
        >
          <View
            style={{
              width:sidebarWidth,
              backgroundColor: AppTheme.colors.surfaceAlt,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: { width: 2, height: 0 },
              elevation: 5,
            }}
          >
            <Image
              source={require('../assets/images/krsna-the-cowheard-boys-taking-prasadam3.png')}
              style={{
                width: '100%',
                height:250,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />

<Pressable
    onPress={() => {
      setSidebarVisible(false);
      router.push('/Login_page');
    }}
    style={({ hovered }) => [
      {
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: AppTheme.colors.border,
        backgroundColor: hovered ? AppTheme.colors.accentSoft : 'transparent',
      },
    ]}
  >
    <Text style={{ fontSize: 18, color: AppTheme.colors.textPrimary, fontWeight: "600" }} className="ml-4 mt-4">Vendor</Text>
  </Pressable>

  <Pressable
    onPress={() => {
      setSidebarVisible(false);
      router.push('/Admin');
    }}
    style={({ hovered }) => [
      {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: AppTheme.colors.border,
        backgroundColor: hovered ? AppTheme.colors.accentSoft : 'transparent',
      },
    ]}
  >
    
    <Text style={{ fontSize: 18, color: AppTheme.colors.textPrimary, fontWeight: "600" }} className="ml-4 mt-4">Admin</Text>
  </Pressable>
          </View>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SidebarMenu;

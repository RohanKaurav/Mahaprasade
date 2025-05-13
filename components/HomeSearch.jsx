import { Platform, View, Text, Keyboard, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon, MenuIcon } from '@/components/ui/icon';
import { db } from "../app/firebase_config";
import { getDocs, collection } from "firebase/firestore";
import { Button, ButtonText, ButtonIcon } from './ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge, BadgeText } from "@/components/ui/badge";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator
} from '@/components/ui/menu';

function HomeSearch() {
  const [query, setQuery] = useState(''); // Keeps track of user input
  const [filterData, setFilterData] = useState([]); // The filtered data array
  const [totalData, setTotalData] = useState([]); // Holds all station data
  const router = useRouter(); // For navigation

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const fetchStations = async () => {
      const snapshot = await getDocs(collection(db, 'stations'));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTotalData(data);
    };

    fetchStations();
  }, []);

  // Handle input change in the search bar
  const handleInputChange = (text) => {
    setQuery(text);
    handleSearchQuery(text);
  };

  // Handle the search query and filter the data
  function handleSearchQuery(text) {
    text = text.toLowerCase(); // Convert text to lowercase for case-insensitive comparison
    const filteredArray = totalData.filter((item) =>
      item.name.toLowerCase().includes(text)
    );
    setFilterData(filteredArray); // Update the filtered data
  }

  function clearQuery() {
    setQuery('');
    Keyboard.dismiss();
    setFilterData([]);
  }

  return (
    <View className="h-full">
      <View className="absolute top-0 left-0 z-10 bg-transparent ">
        <Menu
          offset={0}
          className="bg-white border border-blue-600 rounded-md shadow-lg"
          trigger={({ ...triggerProps }) => {
            return (
              <Pressable {...triggerProps} className="bg-transparent border-0 p-0 active:bg-transparent focus:bg-transparent border-gray-300">
                <MenuIcon className="text-typography-500 w-6 h-6" />
              </Pressable>
            );
          }}
        >
          <MenuItem
            key="Membership"
            textValue="Membership"
            className="p-2 justify-between"
            onPress={() => {
              try {
                router.push(`/Login_page`);
              } catch (error) {
                console.error("Navigation Error:", error);
              }
            }}
          >
            <MenuItemLabel size="sm">Vendor</MenuItemLabel>
            <MenuSeparator />
          </MenuItem>
          <MenuSeparator />
          
          <MenuSeparator />
          <MenuItem
              key="AdminPanel"
              textValue="Admin Panel"
              className="p-2"
              onPress={() => router.push(`/Admin`)}
            >
              <MenuItemLabel size="sm">Login as Admin</MenuItemLabel>
            </MenuItem>
            <MenuSeparator />

    
          <MenuItem key="Logout" textValue="Logout" className="p-2">
            <MenuItemLabel size="sm">Logout</MenuItemLabel>
          </MenuItem>
          
        </Menu>
      </View>
      <View className={"flex flex-col items-center justify-end h-1/2 relative w-full "}>
        {/* Search Bar */}
        <Input className={`${Platform.OS === 'web' ? 'w-[50%]' : 'w-[80%]'} relative z-10 border-blue-800`}>
          <InputField
            onChangeText={handleInputChange}
            value={query}
            placeholder="Search station to order Prasadam"
            className="pl-4 pr-12"
          />

          {/* Dynamic Icon at the end */}
          <InputSlot className="absolute right-3 item-center">
            {query.trim().length === 0 ? (
              <Pressable>
                <InputIcon as={SearchIcon} />
              </Pressable>
            ) : (
              <Pressable onPress={clearQuery}>
                <InputIcon as={CloseIcon} />
              </Pressable>
            )}
          </InputSlot>
        </Input>

        {/* Dropdown Results */}
        {query.trim().length > 0 && (
          <View
            className={`${Platform.OS === 'web' ? 'w-[50%]' : 'w-[80%]'} bg-white rounded-lg border border-gray-300 shadow-md absolute top-full mt-2 z-20`}
          >
            {filterData.length > 0 ? (
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    className="p-3 border-b border-gray-200"
                    onPress={() => router.push(`/station/${item.id}`)}
                  >
                    <Text className="text-gray-800">{item.name}</Text>
                  </Pressable>
                )}
              />
            ) : (
              <Text className="p-4 text-gray-500">No matching station</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export default HomeSearch;

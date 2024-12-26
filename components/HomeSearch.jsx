import { Platform, View, Text, Keyboard, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon } from '@/components/ui/icon';
import { db } from "../app/firebase_config";
import { getDocs, collection } from "firebase/firestore";

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
      <View className={"flex flex-col items-center justify-end h-1/2 relative w-full"}>
        {/* Search Bar */}
        <Input className={`${Platform.OS === 'web' ? 'w-[50%]' : 'w-[80%]'} relative z-10`}>
          <InputField
            onChangeText={handleInputChange}
            value={query}
            placeholder="Search station..."
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
                    onPress={() => 
                         router.push(`/station/${item.id}`)
                      }
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

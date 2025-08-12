import { Platform, View, Text, Keyboard, FlatList, SectionList, Pressable ,Image } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon, MenuIcon } from '@/components/ui/icon';
import { db } from "../app/firebase_config";
import { getDocs, collection } from "firebase/firestore";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import SidebarMenu from './Sidebar'
function HomeSearch() {
  const [query, setQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const sectionListRef = useRef(null);

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

  const handleInputChange = (text) => {
    setQuery(text);
    setShowDropdown(true);
    const filtered = totalData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterData(filtered);
  };

  const clearQuery = () => {
    setQuery('');
    setFilterData([]);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const groupedStations = useMemo(() => {
    const grouped = totalData.reduce((acc, item) => {
      const letter = item.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(item);
      return acc;
    }, {});
    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [totalData]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7C0' }} pointerEvents="box-none">
      
      <View className="flex flex-row items-center w-full px-4 py-2" style={{ backgroundColor: '#2196F3' }}>
        {/* <View style={{ marginRight: 8 }}>
       
          <Menu
            offset={0}
            className="bg-white border border-blue-600 rounded-md shadow-lg"
            trigger={({ ...triggerProps }) => (
              <Pressable {...triggerProps} className="bg-transparent p-0">
                <MenuIcon className="text-black w-8 h-6" />
              </Pressable>
            )}
          >
            <MenuItem disabled>
            <Image
              source={require('../assets/images/krsna-the-cowheard-boys-taking-prasadam3.png')}
              style={{ width: '100%' , height: 100,borderWidth:2, alignSelf: 'center' }}
            />
          </MenuItem>
  <MenuSeparator />
            <MenuItem onPress={() => router.push('/Login_page')}>
              <MenuItemLabel size="sm">Vendor</MenuItemLabel>
            </MenuItem>
            <MenuSeparator />
            <MenuItem onPress={() => router.push('/Admin')}>
              <MenuItemLabel size="sm">Login as Admin</MenuItemLabel>
            </MenuItem>
            <MenuSeparator />
          </Menu>
        </View> */}
        <SidebarMenu></SidebarMenu>
       
        <View style={{ flex: 1 }} className="relative">
          <Input>
            <InputField
              onChangeText={handleInputChange}
              value={query}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Station to Order Prasadam"
              className="pl-10 pr-6"
              style={{
                backgroundColor: '#FFF7C0',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'gray',
              }}
            />
            <InputSlot className="absolute left-3">
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

          
          {showDropdown && query.trim().length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: 6,
                width: '100%',
                backgroundColor: 'white',
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 3,
                zIndex: 1001,
              }}
            >
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <Pressable
                    className="p-3 border-b border-gray-200"
                    onPress={() => {
                      router.push(`/station/${item.id}`);
                      setQuery('');
                      setShowDropdown(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text className="text-gray-800">{item.name}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text className="p-4 text-gray-500">No matching station</Text>
                }
              />
            </View>
          )}
        </View>
      </View>

      
      {query.trim().length === 0 && (
        <>
          <SectionList
            ref={sectionListRef}
            sections={groupedStations}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/station/${item.id}`)}
                className="px-4 py-3 border-b border-gray-300"
              >
                <Text className="text-black text-base">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
              </Pressable>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View className="bg-blue-200 px-4 py-2 mt-2" style={{backgroundColor:'#64B5F6'}}>
                <Text className="font-bold text-lg text-black">{title}</Text>
              </View>
            )}
          />
        </>
      )}
          <View>
            <Pressable 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#2196F3',
              paddingVertical: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 1,
              borderColor: '#ccc',
              zIndex: 1000,
            }}
            onPress={() => router.push('/cities')}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Search Prasadam in Cities</Text>
            </Pressable>
          </View>

       
    </View>
  );
}

export default HomeSearch;

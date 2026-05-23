import { View, Text, Keyboard, FlatList, SectionList, Pressable } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon } from '@/components/ui/icon';
import { db } from "../app/firebase_config";
import { getDocs, collection } from "firebase/firestore";
import SidebarMenu from './Sidebar'
import { AppTheme } from '../constants/AppTheme';
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
    <View style={{ flex: 1, backgroundColor: AppTheme.colors.background }} pointerEvents="box-none">
      
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 14, paddingBottom: 12, paddingTop: 40, backgroundColor: AppTheme.colors.headerBg, borderBottomWidth: 1, borderColor: AppTheme.colors.border }}>
        <SidebarMenu >
          
        </SidebarMenu>
       
        <View style={{ flex: 1, position: "relative" }}>
          <Input>
            <InputField
              onChangeText={handleInputChange}
              value={query}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Station to Order Prasadam"
              className="pl-10 pr-6 pt-0 pb-0"
              style={{
                backgroundColor: AppTheme.colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: AppTheme.colors.border,
               
              }}
            />
            <InputSlot className="absolute left-1" >
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
                backgroundColor: AppTheme.colors.surface,
                borderColor: AppTheme.colors.border,
                borderWidth: 1,
                borderRadius: 12,
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
                    style={{ padding: 12, borderBottomColor: AppTheme.colors.border, borderBottomWidth: 1 }}
                    onPress={() => {
                      router.push(`/station/${item.id}`);
                      setQuery('');
                      setShowDropdown(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={{ color: AppTheme.colors.textPrimary }}>{item.name}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 12, color: AppTheme.colors.textSecondary }}>No matching station</Text>
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
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomColor: AppTheme.colors.border, borderBottomWidth: 1, backgroundColor: AppTheme.colors.surface }}
              >
                <Text style={{ color: AppTheme.colors.textPrimary, fontSize: 16, fontWeight: "500" }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
              </Pressable>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ backgroundColor: AppTheme.colors.accentSoft, paddingHorizontal: 16, paddingVertical: 8, marginTop: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 17, color: AppTheme.colors.accentPrimary }}>{title}</Text>
              </View>
            )}
          />
        </>
      )}
          <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}>
            <Pressable 
            style={{
              backgroundColor: AppTheme.colors.accentPrimary,
              paddingVertical: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 1,
              borderColor: AppTheme.colors.border,
            }}
            onPress={() => router.push('/cities')}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Search Prasadam in Cities</Text>
            </Pressable>
          </View>

       
    </View>
  );
}

export default HomeSearch;

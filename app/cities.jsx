import { View, Text, Keyboard, FlatList, SectionList, Pressable } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon } from '@/components/ui/icon';
import { db } from './firebase_config';
import { getDocs, collection } from 'firebase/firestore';
import AppHeader from '../components/AppHeader';
import { AppTheme } from '../constants/AppTheme';

function CitySearch() {
  const [query, setQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const sectionListRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, 'cities'));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTotalData(data);
    };
    fetchCities();
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

  const groupedCities = useMemo(() => {
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
    <View style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
      <AppHeader title="Search Cities" />
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 }}>
        <View style={{ flex: 1}}>
          <Input>
            <InputField
              onChangeText={handleInputChange}
              value={query}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search City to Order Prasadam"
              className="pl-10 pr-6 pt-0 pb-0"
              style={{
                backgroundColor: AppTheme.colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: AppTheme.colors.border,
              }}
            />
            <InputSlot className="absolute left-3">
              {query.trim().length === 0 ? (
                <Pressable><InputIcon as={SearchIcon} /></Pressable>
              ) : (
                <Pressable onPress={clearQuery}><InputIcon as={CloseIcon} /></Pressable>
              )}
            </InputSlot>
          </Input>

          {showDropdown && query.trim().length > 0 && (
            <View style={{
              position: 'absolute',
              top: '100%',
              marginTop: 8,
              width: '100%',
              backgroundColor: AppTheme.colors.surface,
              borderColor: AppTheme.colors.border,
              borderWidth: 1,
              borderRadius: 12,
              elevation: 3,
              zIndex: 1001,
            }}>
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      router.push(`/city/${item.id}`);
                      setQuery('');
                      setShowDropdown(false);
                      Keyboard.dismiss();
                    }}
                    style={{ padding: 12, borderBottomColor: AppTheme.colors.border, borderBottomWidth: 1 }}
                  >
                    <Text style={{ color: AppTheme.colors.textPrimary }}>{item.name}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 12, color: AppTheme.colors.textSecondary }}>No matching city</Text>
                }
              />
            </View>
          )}
        </View>
      </View>

      {query.trim().length === 0 && (
        <SectionList
          ref={sectionListRef}
          sections={groupedCities}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/city/${item.id}`)}
              style={{ padding: 12, borderBottomColor: AppTheme.colors.border, borderBottomWidth: 1, backgroundColor: AppTheme.colors.surface }}
            >
              <Text style={{ color: AppTheme.colors.textPrimary, fontWeight: "500" }}>{item.name}</Text>
            </Pressable>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: AppTheme.colors.accentSoft, padding: 8 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: AppTheme.colors.accentPrimary }}>{title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

export default CitySearch;

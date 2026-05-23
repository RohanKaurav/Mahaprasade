import { View, Text, FlatList, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../app/firebase_config';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { Button, ButtonText } from '@/components/ui/button';
import { AppTheme } from '../constants/AppTheme';
import AppCard from '../components/AppCard';

function AdminVendorApproval() {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {

    const fetchVendors = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const allVendors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const stationMap = await fetchStations();
      const cityMap=await fetchCities();
   
      const vendorsWithStationNames = allVendors.map((vendor) => {
        const stationName = stationMap[vendor.station] || (vendor.station ? 'Unknown Station' : null);
        const cityName = cityMap[vendor.city] || (vendor.city ? 'Unknown City' : null);
      
        return {
          ...vendor,
          stationName,
          cityName,
        };
      });
      
  
      setPendingVendors(vendorsWithStationNames.filter((v) => !v.isApproved));
      setApprovedVendors(vendorsWithStationNames.filter((v) => v.isApproved));
    };
    fetchVendors();
  }, []);

const fetchStations = async () => {
  const stationSnapshot = await getDocs(collection(db, 'stations'));
  const stationMap = {};
  stationSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    stationMap[doc.id] = displayName;
  });
  return stationMap;
};
const fetchCities = async () => {
  const citySnapshot = await getDocs(collection(db, 'cities'));
  const cityMap = {};
 citySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    cityMap[doc.id] = displayName;
  });
  return cityMap;
};

  const toggleApproval = async (vendorId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'vendors', vendorId), { isApproved: !currentStatus });

      if (currentStatus) {
        const updatedVendor = approvedVendors.find((v) => v.id === vendorId);
        setApprovedVendors((prev) => prev.filter((v) => v.id !== vendorId));
        setPendingVendors((prev) => [...prev, { ...updatedVendor, isApproved: false }]);
      } else {
        const updatedVendor = pendingVendors.find((v) => v.id === vendorId);
        setPendingVendors((prev) => prev.filter((v) => v.id !== vendorId));
        setApprovedVendors((prev) => [...prev, { ...updatedVendor, isApproved: true }]);
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
  };

  const openVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setModalVisible(true);
  };

  const renderVendorCard = (vendor) => (
    <TouchableOpacity onPress={() => openVendorModal(vendor)}>
      <AppCard style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: AppTheme.colors.textPrimary }}>{vendor.name}</Text>
        <Text style={{ fontSize: 13, color: AppTheme.colors.textSecondary }}>Tap to view details</Text>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 14, backgroundColor: AppTheme.colors.background, height: "100%" }}>
      <ScrollView className="font-bold mt-10">
       
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: AppTheme.colors.textPrimary }}>Pending Vendors</Text>
        {pendingVendors.length > 0 ? (
          <FlatList
            data={pendingVendors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderVendorCard(item)}
            scrollEnabled={false}
          />
        ) : (
          <Text style={{ fontSize: 13, marginBottom: 16, color: AppTheme.colors.textSecondary }}>No pending vendors.</Text>
        )}

      
        <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 12, marginBottom: 12, color: AppTheme.colors.textPrimary }}>Approved Vendors</Text>
        {approvedVendors.length > 0 ? (
          <FlatList
            data={approvedVendors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderVendorCard(item)}
            scrollEnabled={false}
          />
        ) : (
          <Text style={{ fontSize: 13, color: AppTheme.colors.textSecondary }}>No approved vendors.</Text>
        )}
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={{ padding: 14, backgroundColor: AppTheme.colors.surface }}>
          {selectedVendor && (
            <>
              <Text className="text-xl font-bold mb-2">{selectedVendor.name}</Text>
              <Text className="text-sm mb-1">📞 {selectedVendor.contact}</Text>
              <Text className="text-sm mb-1">🚉 {selectedVendor.stationName}</Text>
              <Text className="text-sm mb-1">🏙️ {selectedVendor.cityName}</Text>
              <Text className="text-sm mb-1">🏠 {selectedVendor.address}</Text>
              <Text className="text-sm mb-2">📝 {selectedVendor.description}</Text>

              {selectedVendor.menu?.length > 0 && (
                <View className="mb-3">
                  <Text className="font-semibold text-base mb-2">🍽️ Menu:</Text>
                  {selectedVendor.menu.map((item, index) => (
                    <View key={index} className="mb-2 pl-2 border-l-2 border-gray-300">
                      <Text className="text-sm font-semibold">{item.name} — ₹{item.price}</Text>
                      <Text className="text-xs text-gray-500 italic">{item.description}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedVendor.imageurl && (
                <View className="mb-3">
                  <Text className="text-sm font-medium mb-1">Vendor Image:</Text>
                  <Image
                    source={{ uri: selectedVendor.imageurl }}
                    style={{ width: '100%', height: 180, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </View>
              )}

              
              <View className="flex flex-row justify-between mt-4">
                <Button
                  onPress={() => toggleApproval(selectedVendor.id, selectedVendor.isApproved)}
                  className="w-[48%]"
                  style={{ backgroundColor: selectedVendor.isApproved ? AppTheme.colors.warning : AppTheme.colors.success }}
                >
                  <ButtonText className="text-white">
                    {selectedVendor.isApproved ? 'Unapprove' : 'Approve'}
                  </ButtonText>
                </Button>

                <Button
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-400 w-[48%]"
                >
                  <ButtonText className="text-white">Close</ButtonText>
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

export default AdminVendorApproval;

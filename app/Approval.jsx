import { View, Text, FlatList, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../app/firebase_config';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { Button, ButtonText } from '@/components/ui/button';

function AdminVendorApproval() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch pending vendor requests
  useEffect(() => {
    const fetchPendingVendors = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((vendor) => !vendor.isApproved);
      setPendingVendors(data);
    };
    fetchPendingVendors();
  }, []);

  // Approve vendor
  const approveVendor = async (vendorId) => {
    try {
      await updateDoc(doc(db, 'vendors', vendorId), { isApproved: true });
      setPendingVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
      setModalVisible(false);
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  // Open modal with selected vendor
  const openVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setModalVisible(true);
  };

  return (
    <View className="p-4 bg-gray-100 h-full">
      <Text className="text-xl font-bold mb-4">Pending Vendor Approvals</Text>

      {pendingVendors.length > 0 ? (
        <FlatList
          data={pendingVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openVendorModal(item)}>
              <View className="border p-4 mb-3 rounded bg-white shadow">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500">Tap to view details</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No pending vendor requests.</Text>
      )}

      {/* Modal for full vendor details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView className="p-4 bg-white">
          {selectedVendor && (
            <>
              <Text className="text-xl font-bold mb-2">{selectedVendor.name}</Text>
              <Text className="text-sm mb-1">📞 {selectedVendor.contact}</Text>
              <Text className="text-sm mb-1">🏠 {selectedVendor.address}</Text>
              <Text className="text-sm mb-2">📝 {selectedVendor.description}</Text>

              {/* Menu */}
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

              {/* Vendor Image */}
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

              {/* Buttons */}
              <View className="flex flex-row justify-between mt-4">
                <Button
                  onPress={() => approveVendor(selectedVendor.id)}
                  className="bg-green-500 w-[48%]"
                >
                  <ButtonText className="text-white">Approve</ButtonText>
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

import { View, Text, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../app/firebase_config';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { Button, ButtonText } from '@/components/ui/button';

function AdminVendorApproval() {
  const [pendingVendors, setPendingVendors] = useState([]);
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
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Pending Vendor Approvals</Text>
      {pendingVendors.length > 0 ? (
        <FlatList
          data={pendingVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between items-center p-3 border-b">
              <Text>{item.name}</Text>
              <Button onPress={() => approveVendor(item.id)} className="bg-green-500 px-4 py-2 rounded">
                <ButtonText className="text-white">Approve</ButtonText>
              </Button>
            </View>
          )}
        />
      ) : (
        <Text>No pending vendor requests.</Text>
      )}
    </View>
  );
}

export default AdminVendorApproval;

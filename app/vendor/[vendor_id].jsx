import { Image, Pressable, View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import styles from "./vendorstyle.js";
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent,
  ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper,
  ActionsheetItem, ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { db } from '../firebase_config';
import { getDocs, collection } from 'firebase/firestore';

export default function VendorDescription() {
  const { vendor_id } = useLocalSearchParams();
  const [totalCost, setMycost] = useState(0);
  const [count, setCount] = useState({});
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  const handleClose = () => setShowActionsheet(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVendorData(data);
    };
    fetchVendorData();
  }, []);

  const index = vendorData.findIndex((vendor) => vendor.id === vendor_id);
  if (index === -1) return <Text>Vendor not found</Text>;

  const vendor = vendorData[index];

  function toCount(itemName, itemPrice) {
    setCount((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
    setMycost((t) => t + itemPrice);
  }

  function decrementCount(itemName, itemPrice) {
    setCount((prev) => {
      const updated = { ...prev };
      if (updated[itemName] > 0) {
        updated[itemName] -= 1;
        if (updated[itemName] === 0) delete updated[itemName];
      }
      return updated;
    });
    setMycost((t) => t - itemPrice);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10, backgroundColor: '#f5f5f5' }}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {vendor.imageurl ? (
              <Image source={{ uri: vendor.imageurl }} style={styles.vendorImage} />
            ) : (
              <Text>No image available</Text>
            )}
            <Text style={styles.vendorName}>{vendor.name.toUpperCase()}</Text>

            {vendor.menu.map((item) => (
              <View key={item.name} style={styles.menuCard}>
                <Text style={styles.menuTitle}>{item.name.toUpperCase()}</Text>
                <Text style={styles.menuDetails}>Items: {item.description} | Price: ₹{item.price}</Text>

                <View style={styles.buttonRow}>
                  {count[item.name] > 0 && (
                    <TouchableOpacity
                      onPress={() => decrementCount(item.name, item.price)}
                    >
                      <View style={styles.circleButton}><Text style={styles.buttonText}>-</Text></View>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (!count[item.name]) {
                        toCount(item.name, item.price);
                      }
                    }}
                  >
                    <View style={styles.addButton}>
                      <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                        {count[item.name] > 0 ? count[item.name] : 'ADD ITEM'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {count[item.name] > 0 && (
                    <TouchableOpacity
                      onPress={() => toCount(item.name, item.price)}
                    >
                      <View style={styles.circleButton}><Text style={styles.buttonText}>+</Text></View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {Object.values(count).some((q) => q > 0) && (
        <>
          <Pressable style={styles.bottomButtonContainer} onPress={() => setShowActionsheet(true)}>
            <Text style={styles.bottomButtonText}>See Your Items</Text>
          </Pressable>

          <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>

              {vendor.menu.map(
                (item) =>
                  count[item.name] > 0 && (
                    <ActionsheetItem key={item.name}>
                      <ActionsheetItemText>
                        Item: {item.name} | Qty: {count[item.name]}
                      </ActionsheetItemText>
                    </ActionsheetItem>
                  )
              )}

              <ActionsheetItem>
                <ActionsheetItemText>Total Cost: ₹{totalCost}</ActionsheetItemText>
              </ActionsheetItem>

              <ActionsheetItem
              onPress={async () => {
              try {
                const rawPhone = vendor.contact.replace(/[^\d]/g, ''); // keep digits only
                const phoneNumber = `91${rawPhone.slice(-10)}`; // ensure last 10 digits
                const orderDetails = Object.entries(count)
                  .map(([itemName, quantity]) => `${itemName}: ${quantity}`)
                  .join('\n');

                const plainMessage = `Hare Krishna 🙏\nI would like to place an order:\n${orderDetails}\nTotal Cost: ₹${totalCost}`;
                const encodedMessage = encodeURIComponent(plainMessage);
                const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
                const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;
                const telUrl = `tel:${phoneNumber}`;

                const supported = await Linking.canOpenURL(whatsappUrl);
                if (supported) {
                  await Linking.openURL(whatsappUrl);
                } else {
                  throw new Error('WhatsApp not supported');
                }
              } catch (error) {
                Alert.alert('WhatsApp not available', 'Try calling or sending an SMS.', [
                  { text: 'Call Vendor', onPress: () => Linking.openURL(`tel:${vendor.contact}`) },
                  { text: 'Send SMS', onPress: () => Linking.openURL(`sms:${vendor.contact}`) },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }
            }}
          >
            <ActionsheetItemText>Order Now</ActionsheetItemText>
          </ActionsheetItem>



              <ActionsheetItem onPress={handleClose}>
                <ActionsheetItemText>Cancel</ActionsheetItemText>
              </ActionsheetItem>
            </ActionsheetContent>
          </Actionsheet>
        </>
      )}
    </View>
  );
}

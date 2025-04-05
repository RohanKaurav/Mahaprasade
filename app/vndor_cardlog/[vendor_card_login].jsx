import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import { db } from "../firebase_config";
import { getDoc, updateDoc, doc, getDocs, collection } from "firebase/firestore";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
} from 'react-native';
import styles from './menu_style.js';

export default function Menu() {
  const { vendor_card_login } = useLocalSearchParams();
  
  const [menu, setMenu] = useState([]);
  const [vendorDetails, setVendorDetails] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: '', name: '', price: '', description: '' });

  useEffect(() => {
    const fetchVendorData = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const vendor = data.find(v => v.id === vendor_card_login);

      if (vendor) {
        setVendorDetails({
          name: vendor.name,
          contact: vendor.contact,
          address: vendor.address,
          description: vendor.description,
          image: vendor.image,
        });
        setMenu(vendor.menu || []);
      }
    };

    fetchVendorData();
  }, []);

  const handleUpdateProfile  = async () => {
    if (!vendor_card_login || vendor_card_login === "-1") {
      alert("Invalid Vendor ID!");
      return;
    }

    try {
      const vendorRef = doc(db, "vendors", vendor_card_login);
      await updateDoc(vendorRef, {
        name: vendorDetails.name,
        contact: vendorDetails.contact,
        address: vendorDetails.address,
        description: vendorDetails.description,
      });

      alert("Profile updated successfully!");
      setProfileModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  const handleSaveMenuItem = async () => {
    if (!currentItem.name || !currentItem.price) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const vendorRef = doc(db, "vendors", vendor_card_login);
      const vendorSnap = await getDoc(vendorRef);
      const vendorData = vendorSnap.data();
      const existingMenu = vendorData.menu || [];
  
      let updatedMenu;
  
      if (currentItem.id) {
        // Update existing item
        updatedMenu = existingMenu.map((item) =>
          item.id === currentItem.id ? { ...currentItem, price: parseFloat(currentItem.price) } : item
        );
      } else {
        // **Forcing a properly structured ID**
        const uniqueID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
        const newItem = {
          id: uniqueID, // 🔹 Ensuring ID is properly assigned
          name: currentItem.name,
          price: parseFloat(currentItem.price),
          description: currentItem.description,
        };
  
        updatedMenu = [...existingMenu, newItem];
        // console.log("New item being added:", newItem); // Debugging log
      }
  
      // console.log("Updated menu before writing to Firestore:", updatedMenu);
  
      await updateDoc(vendorRef, { menu: updatedMenu });
      setMenu(updatedMenu);
      setMenuModalVisible(false);
      setCurrentItem({ id: '', name: '', price: '', description: '' });
  
      alert("Menu updated successfully!");
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Failed to update menu.");
    }
  };
  
  
  
  const handleDeleteMenuItem = async (id) => {
    try {
      const updatedMenu = menu.filter((item) => item.id !== id);
      await updateDoc(doc(db, "vendors", vendor_card_login), { menu: updatedMenu });
      setMenu(updatedMenu);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };
  

  const handleEditMenuItem = (item) => {
    setCurrentItem(item);
    setMenuModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.vendorContainer, styles.shadow]}>
        <Image source={{ uri: vendorDetails.image }} style={styles.vendorImage} />
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{vendorDetails.name}</Text>
          <Text style={styles.vendorDescription}>{vendorDetails.description}</Text>
          <Text style={styles.vendorDetail}>📍 {vendorDetails.address}</Text>
          <Text style={styles.vendorDetail}>📞 {vendorDetails.contact}</Text>
          <Button title="Edit Profile" onPress={() => setProfileModalVisible(true)} />
        </View>
      </View>

      <Modal visible={profileModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Shop Details</Text>
            <TextInput style={styles.input} placeholder="Shop Name" value={vendorDetails.name} onChangeText={text => setVendorDetails({ ...vendorDetails, name: text })} />
            <TextInput style={styles.input} placeholder="Contact" keyboardType="phone-pad" value={vendorDetails.contact} onChangeText={text => setVendorDetails({ ...vendorDetails, contact: text })} />
            <TextInput style={styles.input} placeholder="Address" value={vendorDetails.address} onChangeText={text => setVendorDetails({ ...vendorDetails, address: text })} />
            <TextInput style={styles.input} placeholder="Description" value={vendorDetails.description} onChangeText={text => setVendorDetails({ ...vendorDetails, description: text })} />

            <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleUpdateProfile} />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: 'grey' }]} onPress={() => setProfileModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

          </View>
        </View>
      </Modal>

      <Modal visible={menuModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{currentItem.id ? 'Edit Item' : 'Add Item'}</Text>
            <TextInput style={styles.input} placeholder="Name" value={currentItem.name} onChangeText={text => setCurrentItem({ ...currentItem, name: text })} />
            <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={currentItem.price.toString()} onChangeText={text => setCurrentItem({ ...currentItem, price: text })} />
            <TextInput style={styles.input} placeholder="Description" value={currentItem.description} onChangeText={text => setCurrentItem({ ...currentItem, description: text })} />
            <TouchableOpacity style={styles.addButton} onPress= {handleSaveMenuItem}>
              <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>  
              <br>
              </br>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: 'grey' }]} onPress={() => setMenuModalVisible(false)}>
              <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>Price: ₹{item.price}</Text>
            <Text>{item.description}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditMenuItem(item)}>
                <Text style={styles.buttonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMenuItem(item.id)}>
                <Text style={styles.buttonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setMenuModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

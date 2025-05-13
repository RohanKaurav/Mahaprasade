import {Image, StyleSheet, Platform, Pressable,View, Text, Button,TouchableOpacity,ScrollView,Linking, } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import styles from "./vendorstyle.js";
import {Actionsheet,ActionsheetBackdrop,ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText,ActionsheetIcon,
} from '@/components/ui/actionsheet';
import { db,storage } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";


export default function VendorDesciption() {
     const { vendor_id } = useLocalSearchParams();
     const [myItems,setMyitems]=useState([]);
     const [totalCost,setMycost]=useState(0);
     const [selectedItemsString, setSelectedItemsString] = useState(""); 
     const [count,setCount]=useState({});
     const [showActionsheet, setShowActionsheet] =useState(false);
     const handleClose = () => setShowActionsheet(false);
     const [vendorData, setVendorData] = useState([]);
   
     

  useEffect(() => {
    const fetchVendorData = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        
      } ));
      setVendorData(data);
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    if (myItems.length > 0) {
      setSelectedItemsString(myItems.join(', ')); 
    } else {
      setSelectedItemsString(''); 
    }
  }, [myItems]); 

  const index=vendorData.findIndex(vendor=>vendor.id===(vendor_id));
     if (index === -1) {
        return <Text>Vendor  not found</Text>;
   }

  
  //Function to add items to the list
  function itemsInstring(itm) {
    setMyitems(prevItems => [...prevItems, itm]); // Correctly update the state
  }
  
  
  

  function toCount(item) {
    setCount(prevCount => ({
      ...prevCount,
      [item]: (prevCount[item] || 0) + 1 // Increment count for the item
    }));
  }

  function decrementCount(item) {
    setCount(prevCount => {
      const updatedCount = { ...prevCount };
      if (updatedCount[item] > 0) {
        updatedCount[item] -= 1; // Decrement the count
        if( updatedCount[item] === 0 ){
          delete updatedCount[item];
        }

      } else {
        delete updatedCount[item]; // Remove the item if count reaches 0
      }
      return updatedCount;
    });
  
    setMyitems(prevItems => {
      const idex = prevItems.indexOf(item); // Find the first occurrence of the item
      if (idex > -1) {
        const updatedItems = [...prevItems];
        updatedItems.splice(idex, 1); // Remove the item at the found index
       return updatedItems;
      }
     return prevItems;
    });

    

  }
  
    return (
      <ScrollView  contentContainerStyle={{ flexGrow: 1 }}>
      <View   style={{
      flex: 1,
      justifyContent: 'center', // Vertical centering
      alignItems: 'center', // Horizontal centering
      padding: 5, // Optional padding
    }}>
      <View >
        <View style={styles.contnt}>
        <View style={styles.imgBlock}>
        {vendorData[index].imageurl ? (
            <Image
              style={styles.img}
              alt="Vendor Image"
              source={{ uri: vendorData[index].imageurl }}
            />
            
          ) : (
            <Text>No image available</Text>
          )}
        <Text style={styles.vendorName} >{(vendorData[index].name).toUpperCase()}</Text>
              

        <View   style={styles.bdy} className={`${Platform.OS === 'web' ? 'w-[100%]' : 'w-[100%]'}`}>
          <View >
            {/* <Text style={styles.menu}>Menu</Text> */}
            {vendorData[index].menu.map((items)=>(
              <View style={{ flex: 1,width: "100%" }}>
              <View style={styles.list} key={items.name}>
                <View style={{ flex: 1 ,width: "100%" }}>
                <Text className="text-lg font-bold text-gray-800" style={{fontWeight:'bold',width: "100%",fontSize:'20px', marginBottom:'20px' }}>
                  {items.name.toUpperCase()} 
                </Text>
                 <Text>Items: {items.description}       Prices: {items.price}</Text>
                
              </View>
                <View style={styles.buttn}>

                {/* Minus Button */}
                {count[items.name] > 0 ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        decrementCount(items.name);
                        setMycost(t => t - items.price);
                        
                      }}
                    >
                      <View ><Text style={styles.btn_mns} >-</Text></View>
                    </TouchableOpacity>
                  ) : null}

                  {/* add button */}
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        if(!count[items.name]){
                        itemsInstring(items.name);
                        setMycost(t => t + items.price);
                        toCount(items.name);
                        }
          
                      
                      }}
                    >
                      <View style={styles.addbtn}><Text>{ count[items.name]>0?count[items.name] : "ADD ITEM"}</Text></View>  {/*dynamic text */}
                    </TouchableOpacity>
                  

                  {/* Plus Button */}
                  {count[items.name] > 0 ? (
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      itemsInstring(items.name);
                      setMycost(t => t + items.price);
                      toCount(items.name);
                    }}
                  >
                    <View ><Text style={styles.btn_pls}>+</Text></View>
                  </TouchableOpacity>
                   ) : null}
                </View>
              </View>

            {/* In this section we have to add images, for this add images to vendor.json file */}

            </View>
            
            ))}
          </View>
        </View>   
        </View>
      </View>
      {Object.values(count).some(quantity => quantity > 0) && (
        <>
        <br></br>
        
                 <Pressable
                    style={[styles.bottomButtonContainer]}
                    onPress={() => setShowActionsheet(true)}
                  >
                    <Text className="text-gray-800">See Your Items</Text>
                  </Pressable>
                  
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {vendorData[index].menu.map((items) => (
          count[items.name] > 0 && ( // Only show items with a count > 0
            <ActionsheetItem key={items.name}>
              <ActionsheetItemText>
                Item: {items.name} | Qnt: {count[items.name]}
              </ActionsheetItemText>
            </ActionsheetItem>
          ) ))}
   
          <ActionsheetItem >
            <ActionsheetItemText>Cost: ₨{totalCost}</ActionsheetItemText>
          </ActionsheetItem>

                  <ActionsheetItem
          onPress={async () => {
            const rawNumber = vendorData[index].contact;
            const countryCode = '91'; // change if needed
            const phoneNumber = `${countryCode}${rawNumber}`;
            const orderDetails = Object.entries(count)
              .map(([itemName, quantity]) => `${itemName}: ${quantity}`)
              .join('\n');
            const message = encodeURIComponent(
              `Hello, I would like to place an order:\n\n${orderDetails}\n\nTotal Cost: ₨${totalCost}`
            );
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            const smsUrl = `sms:${phoneNumber}?body=${message}`;
            const telUrl = `tel:${phoneNumber}`;

            try {
              const supported = await Linking.canOpenURL(whatsappUrl);
              if (supported) {
                await Linking.openURL(whatsappUrl);
              } else {
                throw new Error('WhatsApp not supported');
              }
            } catch (error) {
              Alert.alert(
                'Vendor Not on WhatsApp',
                'This vendor may not be using WhatsApp. You can try contacting them through the options below:',
                [
                  {
                    text: 'Call Vendor',
                    onPress: () => Linking.openURL(telUrl),
                  },
                  {
                    text: 'Send SMS',
                    onPress: () => Linking.openURL(smsUrl),
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]
              );
            }
          }}
        >
          <ActionsheetItemText>Order Now</ActionsheetItemText>
        </ActionsheetItem>


          <ActionsheetItem  onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
</>
      )}
      </View>
        </View>
        </ScrollView>
        
    );
  }
  
import { View, Text, FlatList, Image, Pressable ,TextInput,Input} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { Icon } from '@/components/ui/icon';
import { CloseIcon } from '@/components/ui/icon';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'

import {
    Button,
    ButtonText,
    ButtonSpinner,
    ButtonIcon,
    ButtonGroup,
  } from "@/components/ui/button"

function StationDetails() {
    const  {id} = useLocalSearchParams() // Retrieve the dynamic station ID from the route

    const [stationData, setStationData] = useState([]); // useState to set station data
    const [vendorData, setVendorData] = useState([]); // useState to set vendor data

    useEffect(() => {
        const fetchStations = async () => {
          const snapshot = await getDocs(collection(db, 'stations'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setStationData(data);
        };
    
        fetchStations();
      }, []);


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


      const station = stationData.find((item) => item.id === id);  // finding particular station object
    
        if (!station) {
            return (
                <View >
                    <Text>Station not found</Text>
                </View>
            );
        }
    
        
    const vendors = vendorData.filter((vendor) =>
        station.vendors_list.includes(vendor.id)
    );

    return (
        <>
        <Stack.Screen options={{ headerLeft: () => <Button onPress={()=>{
            if(router.canGoBack()){
                router.back()
            }else{
                router.navigate("/")
            }
            
        }} style={{ backgroundColor: "#facc15", }}>
             <Icon as={ArrowLeftIcon} className="font-bold"/>
        </Button>,
                headerTitle: station.name,
                headerTitleStyle: {
                    fontSize: 18, // text-lg => 1.125rem = 18px
                    fontWeight: 'bold', // font-bold
                    color: '#1F2937', // text-gray-800 => #1F2937
                    textAlign: 'Center',
                  },
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#facc15', // Set background to white
                  }

         }} />
        <FlatList  
                    data={vendors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                />
                
        </>
        
    );
}



export default StationDetails;

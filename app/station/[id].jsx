import { View, Text, FlatList,} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { Icon } from '@/components/ui/icon';
import { CloseIcon } from '@/components/ui/icon';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'
import { Button, } from "@/components/ui/button"

function StationDetails() {
    const  {id} = useLocalSearchParams() 
    const [stationData, setStationData] = useState([]); 
    const [vendorData, setVendorData] = useState([]); 
    const [loadingStations, setLoadingStations] = useState(true);
    const [loadingVendors, setLoadingVendors] = useState(true);


    useEffect(() => {
        const fetchStations = async () => {
          const snapshot = await getDocs(collection(db, 'stations'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setStationData(data);
          setLoadingStations(false);
        };
    
        fetchStations();
      }, []);


    useEffect(() => {
        const fetchVendorData = async () => {
          const snapshot = await getDocs(collection(db, 'vendors'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            
          } )).filter((vendor) => vendor.isApproved);
          setVendorData(data);
          setLoadingVendors(false)
        };
    
        fetchVendorData();
      }, []);


      const station = stationData.find((item) => item.id === id); 
      if (loadingStations || loadingVendors) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }    
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
            
        }} style={{ backgroundColor: "#2196F3", }}>
             <Icon as={ArrowLeftIcon} className="font-bold"/>
        </Button>,
                headerTitle: station.name,
                headerTitleStyle: {
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    color: '#1F2937', 
                    textAlign: 'Center',
                  },
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#2196F3', 
                  }

         }} />
        <FlatList  
                    data={vendors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                    style={{backgroundColor: '#FFF7C0',}}
                />
                
        </>
        
    );
}



export default StationDetails;

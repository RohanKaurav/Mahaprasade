import { View, Text, FlatList,} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'
import { Button, } from "@/components/ui/button"

function CityDetails() {
    const  {city_id} = useLocalSearchParams() 
    const [cityData, setCityData] = useState([]); 
    const [vendorData, setVendorData] = useState([]); 
    const [loadingCities, setLoadingCities] = useState(true);
    const [loadingVendors, setLoadingVendors] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
          const snapshot = await getDocs(collection(db, 'cities'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCityData(data);
          setLoadingCities(false);
        };
    
        fetchCities();
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


      const city = cityData.find((item) => item.id === city_id); 
      if (loadingCities || loadingVendors) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }    
        if (!city) {
            return (
                <View >
                    <Text>City not found</Text>
                </View>
            );
        }
    
        
        const vendors = vendorData.filter((vendor) =>
        city.vendors_list.includes(vendor.id)
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
                headerTitle:city.name,
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



export default CityDetails;

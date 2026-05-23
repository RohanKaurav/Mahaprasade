import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'
import AppHeader from '../../components/AppHeader';
import { AppTheme } from '../../constants/AppTheme';

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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppTheme.colors.background }}>
                <Text style={{ color: AppTheme.colors.textSecondary }}>Loading...</Text>
            </View>
        );
    }    
        if (!city) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppTheme.colors.background }}>
                    <Text style={{ color: AppTheme.colors.textSecondary }}>City not found</Text>
                </View>
            );
        }
    
        
        const vendors = vendorData.filter((vendor) =>
        city.vendors_list.includes(vendor.id)
    );

    return (
        <View style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
        <AppHeader title={city.name} />
        <FlatList  
                    data={vendors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                    style={{backgroundColor: AppTheme.colors.background}}
                />
        </View>
        
    );
}



export default CityDetails;

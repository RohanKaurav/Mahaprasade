import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'
import AppHeader from '../../components/AppHeader';
import { AppTheme } from '../../constants/AppTheme';

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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppTheme.colors.background }}>
                <Text style={{ color: AppTheme.colors.textSecondary }}>Loading...</Text>
            </View>
        );
    }    
        if (!station) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppTheme.colors.background }}>
                    <Text style={{ color: AppTheme.colors.textSecondary }}>Station not found</Text>
                </View>
            );
        }
    
        
        const vendors = vendorData.filter((vendor) =>
        station.vendors_list.includes(vendor.id)
    );

    return (
        <View style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
        <AppHeader title={station.name} />
        <FlatList  
                    data={vendors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                    style={{backgroundColor: AppTheme.colors.background}}
                />
        </View>
        
    );
}



export default StationDetails;

import {View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

function VendorCard({ vendor }) {
    const router = useRouter(); 

    
    return (
        <Pressable onPress={() => router.push(`/vendor/${vendor.id}`)} className="p-4 bg-white rounded-lg shadow-md "  style={{
            marginHorizontal: 10, 
            marginTop: 4,        
            marginBottom: 10,     
        }}>
            <View className="flex-row items-center">
                <Image
                    source={{ uri: vendor.img }}
                    className="w-16 h-16 rounded-lg mr-2.5 "
                    style= {{marginBottom: 3,}}
                />
                <View style={{marginLeft: 6}} >
                    <Text className="text-lg font-bold text-gray-800">{vendor.name}</Text>
                    <Text className="text-sm text-gray-600 my-2">{vendor.description}</Text>
                </View>
            </View>

            
            <View>
                
                <Text className="text-sm text-gray-600">Contact: {vendor.contact}</Text>
                <Text className="text-sm text-gray-600">Address: {vendor.address}</Text>
            </View>
        </Pressable>
    );
}

export default VendorCard;

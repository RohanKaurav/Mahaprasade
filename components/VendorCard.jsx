import { View, Text, Image, Pressable } from 'react-native';

function VendorCard({ vendor }) {
    return (
        <Pressable className="p-4 bg-white rounded-lg shadow-md "  style={{
            marginHorizontal: 10, // mx-1
            marginTop: 4,        // mt-1
            marginBottom: 10,     // mb-2
        }}>
            {/* <View>
                <Image
                    source={{ uri: vendor.img }}
                    className="w-24 h-24 rounded-lg mb-4"
                />

                <Text className="text-lg font-bold text-gray-800">{vendor.name}</Text>
                <Text className="text-sm text-gray-600 my-2">{vendor.description}</Text>
            </View> */}
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

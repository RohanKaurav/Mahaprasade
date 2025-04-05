import { Image, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { db, storage } from "../app/firebase_config";
import { getDocs, collection, addDoc,doc,getDoc,updateDoc,arrayUnion  } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "@/components/ui/icon";

export default function Login_page() {
  const [mobNum, setMobNum] = useState("");
  const [passWord, setPassWord] = useState("");
  const [confPass, setConfpass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [typeofUser, setType0fUser] = useState("Login");
  const [sign, setSign] = useState("Sign In");
  const [Vendor, setVendor] = useState("New Vendor");
  const [totalData, setTotalData] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [newStationName,setNewStationName]=useState("");
  // Fetch vendors from Firestore
  useEffect(() => {
    const fetchVendors = async () => {
      const snapshot = await getDocs(collection(db, "vendors"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTotalData(data);
    };

    const fetchStations = async () => {
      const snapshot = await getDocs(collection(db, "stations"));
      const data = snapshot.docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
      }));
      setStations(data);
    };

    fetchVendors();
    fetchStations();
  }, []);

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (imageUri) => {
    if (!imageUri) return null;

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

       const fileName = `images/${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!mobNum.trim() || !passWord.trim()) {
      alert("Mobile number and password are required");
      return;
    }
  
    if (typeofUser === "Make New Account" && passWord !== confPass) {
      alert("Password and Confirm Password do not match");
      return;
    }
  
    setShowPassword(false);
  
    if (typeofUser === "Login") {
      const vendor = totalData.find(
        (v) => v.contact === mobNum && v.password === passWord
      );
      if (vendor) {
        router.push(`/vndor_cardlog/${vendor.id}`);
      } else {
        alert("Invalid Mobile Number or Password");
      }
    } else {
      const existingVendor = totalData.find((v) => v.contact === mobNum);
      if (existingVendor) {
        alert("This mobile number is already registered. Please use a different number.");
        return;
      }
  
      let stationId = selectedStation;
  
      if (selectedStation === "other" && newStationName.trim() !== "") {
        try {
          const newStationRef = await addDoc(collection(db, "stations"), {
            name: newStationName,
            vendors: [],
          });
          stationId = newStationRef.id;
          setStations([...stations, { id: stationId, name: newStationName }]);
        } catch (error) {
          console.error("🔥 Error adding new station:", error);
          alert("Failed to add new station");
          return;
        }
      }
  
      try {
        let uploadedImageUrl = "";
        if (imageUri) {
          uploadedImageUrl = await uploadImageToFirebase(imageUri);
        }
  
        const newVendorRef = await addDoc(collection(db, "vendors"), {
          contact: mobNum,
          password: passWord,
          shopName: "",
          description: "",
          imageurl: uploadedImageUrl,
          station: stationId,
        });
  
        console.log("✅ Vendor added with ID:", newVendorRef.id);
  
        const stationRef = doc(db, "stations", stationId);
        const stationSnap = await getDoc(stationRef);
  
        if (stationSnap.exists()) {
          await updateDoc(stationRef, {
            vendors_list: arrayUnion(newVendorRef.id),
          });
          console.log("✅ Vendor linked to station:", stationId);
        } else {
          console.warn("⚠️ Station not found in Firestore:", stationId);
        }
  
        // If everything was successful, don't show an error
        alert("Account created successfully!");
        router.push(`/vndor_cardlog/${newVendorRef.id}`);
      } catch (error) {
        console.error("🔥 Error in vendor registration:", error);
        alert(`Failed to create account: ${error.message}`);
      }
    }
  };
  
  
  

  const handleNewVendorClick = () => {
    setType0fUser("Make New Account");
    setSign("Sign Up");
    setVendor("");
    setPassWord("");
    setMobNum("");
    setConfpass("");
    setImageUri(null);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="w-full max-w-sm p-4">
        <FormControl className="bg-white rounded-lg p-4 shadow-lg">
          <VStack space="xs">
            <Heading className="text-center text-xl font-bold mb-4 text-typography-900">
              {typeofUser}
            </Heading>

            <VStack space="xs">
              <Text className="text-sm text-gray-600 mb-1">Mobile No.</Text>
              <Input>
                <InputField
                  type="text"
                  value={mobNum}
                  onChangeText={(text) => setMobNum(text)}
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-sm text-gray-600 mb-1">Password</Text>
              <Input className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  value={passWord}
                  onChangeText={(text) => setPassWord(text)}
                />
                <InputSlot onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            </VStack>

            {typeofUser === "Make New Account" && (
              <>
                <VStack space="xs">
                  <Text className="text-sm text-gray-600 mb-1">
                    Confirm Password
                  </Text>
                  <Input>
                    <InputField
                      type={showPassword ? "text" : "password"}
                      value={confPass}
                      onChangeText={(text) => setConfpass(text)}
                    />
                  </Input>
                </VStack>
               
                <VStack space="xs">
                        <Text className="text-sm text-gray-600 mb-1">Select Station</Text>
                        <View className="border border-gray-300 rounded-md bg-white px-3 py-2">
                          <Picker
                            selectedValue={selectedStation}
                            onValueChange={(itemValue) => setSelectedStation(itemValue)}
                          >
                            <Picker.Item label="Select Station" value="" />
                            {stations.map((station) => (
                              <Picker.Item key={station.id} label={station.name} value={station.id} />
                            ))}
                            <Picker.Item label="Other (Add New Station)" value="other" />
                          </Picker>
                        </View>
                      </VStack>

                      {selectedStation === "other" && (
                        <VStack space="xs">
                          <Text className="text-sm text-gray-600 mb-1">Enter New Station Name</Text>
                          <Input>
                            <InputField
                              type="text"
                              value={newStationName}
                              onChangeText={(text) => setNewStationName(text)}
                            />
                          </Input>
                        </VStack>
                      )}

                
                <VStack space="xs">
                  <Text className="text-sm text-gray-600 mb-1">
                    Upload Image
                  </Text>
                  <TouchableOpacity onPress={pickImage} className="bg-gray-200 p-2 rounded-md">
                    <Text className="text-center">Select Image</Text>
                  </TouchableOpacity>
                  {imageUri && (
                    <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} />
                  )}
                </VStack>
              </>
            )}

            <Button className="bg-blue-500 rounded-md py-2 mt-4" onPress={handleSubmit}>
              <ButtonText>{sign}</ButtonText>
            </Button>
          </VStack>
        </FormControl>

        <TouchableOpacity onPress={handleNewVendorClick} className="mt-4">
          <Text className="text-center text-blue-500 font-medium">{Vendor}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
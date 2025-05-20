import { Image, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { db, storage } from "../app/firebase_config";
import { getDocs, collection, addDoc, doc, updateDoc, arrayUnion, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from "@react-native-picker/picker";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "@/components/ui/icon";

export default function LoginPage() {
  const [mobNum, setMobNum] = useState("");
  const [passWord, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [typeOfUser, setTypeOfUser] = useState("Login");
  const [authButtonText, setAuthButtonText] = useState("Sign In");
  const [toggleToSignUpText, setToggleToSignUpText] = useState("New Vendor");
  const [totalVendors, setTotalVendors] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [newStationName, setNewStationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const vendorSnapshot = await getDocs(collection(db, "vendors"));
      setTotalVendors(vendorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const stationSnapshot = await getDocs(collection(db, "stations"));
      setStations(stationSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchInitialData();
  }, []);

  const handleState = () => setShowPassword(!showPassword);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImageUri(compressed.uri);
    }
  };

  const normalizeNumber = (num) => num.replace(/^\+91|^0/, "").trim();

  const uploadImageToFirebase = async (uri) => {
    if (!uri) return { downloadURL: "", filePath: "" };

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filePath = `vendorImages/${Date.now()}.jpg`;
      const storageRef = ref(storage, filePath);
      await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return { downloadURL, filePath };
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
      return { downloadURL: "", filePath: "" };
    }
  };

  const isValidPhone = (num) => /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(num);

  const handleSubmit = async () => {
    const normalizedMob = normalizeNumber(mobNum);
    if (!normalizedMob || !passWord.trim()) return alert("Mobile number and password are required");
    if (!isValidPhone(mobNum)) return alert("Enter a valid Indian mobile number");
    if (typeOfUser === "Make New Account" && passWord !== confirmPassword) return alert("Passwords do not match");

    setIsSubmitting(true);
    try {
      if (typeOfUser === "Login") {
        const vendor = totalVendors.find(
          (v) => normalizeNumber(v.contact) === normalizedMob && v.password === passWord
        );
        if (vendor) {
          router.push(`/vndor_cardlog/${vendor.id}`);
          setMobNum(""); setPassWord("");
        } else {
          alert("Invalid Mobile Number or Password");
        }
      } else {
        const q = query(collection(db, "vendors"), where("contact", "==", normalizedMob));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) return alert("This mobile number is already registered.");

        let stationId = selectedStation;
        if (stationId === "other" && newStationName.trim()) {
          const newStationRef = await addDoc(collection(db, "stations"), {
            name: newStationName,
            vendors_list: [],
          });
          stationId = newStationRef.id;
          setStations([...stations, { id: stationId, name: newStationName }]);
        }

        const { downloadURL, filePath } = await uploadImageToFirebase(imageUri);

        const newVendorRef = await addDoc(collection(db, "vendors"), {
          contact: normalizedMob,
          password: passWord,
          shopName: "",
          description: "",
          imageurl: downloadURL,
          imagePath: filePath,
          station: stationId,
        });

        const stationRef = doc(db, "stations", stationId);
        await updateDoc(stationRef, { vendors_list: arrayUnion(newVendorRef.id) });

        alert("Account created successfully! Wait for admin approval.");

        setMobNum("");
        setPassWord("");
        setConfirmPassword("");
        setImageUri(null);
        setSelectedStation("");
        setNewStationName("");

        router.push(`/vndor_cardlog/${newVendorRef.id}`);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewVendorClick = () => {
    setTypeOfUser("Make New Account");
    setAuthButtonText("Sign Up");
    setToggleToSignUpText("");
    setMobNum("");
    setPassWord("");
    setConfirmPassword("");
    setImageUri(null);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="w-full max-w-sm p-4">
        <FormControl className="bg-white rounded-lg p-4 shadow-lg">
          <VStack space="xs">
            <Heading className="text-center text-xl font-bold mb-4 text-typography-900">
              {typeOfUser}
            </Heading>

            <VStack space="xs">
              <Text className="text-sm text-gray-600 mb-1">Whatsapp No.</Text>
              <Input>
                <InputField type="text" value={mobNum} onChangeText={setMobNum} />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-sm text-gray-600 mb-1">Password</Text>
              <Input className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  value={passWord}
                  onChangeText={setPassWord}
                />
                <InputSlot onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            </VStack>

            {typeOfUser === "Make New Account" && (
              <>
                <VStack space="xs">
                  <Text className="text-sm text-gray-600 mb-1">Confirm Password</Text>
                  <Input>
                    <InputField
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text className="text-sm text-gray-600 mb-1">Select Station</Text>
                  <View className="border border-gray-300 rounded-md bg-white px-3 py-2">
                    <Picker selectedValue={selectedStation} onValueChange={setSelectedStation}>
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
                      <InputField type="text" value={newStationName} onChangeText={setNewStationName} />
                    </Input>
                  </VStack>
                )}

                <VStack space="xs">
                  <Text className="text-sm text-gray-600 mb-1">Upload Image</Text>
                  <TouchableOpacity onPress={pickImage} className="bg-gray-200 p-2 rounded-md">
                    <Text className="text-center">Select Image</Text>
                  </TouchableOpacity>
                  {imageUri && (
                    <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} />
                  )}
                </VStack>
              </>
            )}

            <Button className="bg-blue-500 rounded-md py-2 mt-4" onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText>{authButtonText}</ButtonText>
              )}
            </Button>
          </VStack>
        </FormControl>

        <TouchableOpacity onPress={handleNewVendorClick} className="mt-4">
          <Text className="text-center text-blue-500 font-medium">{toggleToSignUpText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

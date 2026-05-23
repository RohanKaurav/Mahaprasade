import { useState } from 'react';
import { Text, View, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Button, ButtonText } from '@/components/ui/button';
import { AppTheme } from '../constants/AppTheme';

function CustomMenu() {
  const [isModalVisible, setModalVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();

  const handleAdminLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setModalVisible(false);
        router.push('/Approval'); 
      } 
      else {
        console.log("kuch gadwad hai")
        alert('Access Denied', 'You are not an admin.');
      }
    } catch (_error) {
      alert('Access Denied', 'You are not an admin.');
      
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
  

      {/* Admin Login Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="p-6 rounded-lg w-[80%]" style={{ backgroundColor: AppTheme.colors.surface, borderWidth: 1, borderColor: AppTheme.colors.border }}>
            <Text className="text-lg font-bold mb-4" style={{ color: AppTheme.colors.textPrimary }}>Admin Login</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="p-2 mb-2 rounded"
              style={{ borderWidth: 1, borderColor: AppTheme.colors.border, color: AppTheme.colors.textPrimary }}
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className="p-2 mb-4 rounded"
              style={{ borderWidth: 1, borderColor: AppTheme.colors.border, color: AppTheme.colors.textPrimary }}
              secureTextEntry
            />

            <Button onPress={handleAdminLogin} className="p-2 rounded" style={{ backgroundColor: AppTheme.colors.accentPrimary }}>
              <ButtonText className="text-white">Login</ButtonText>
            </Button>

            <Button onPress={() =>router.back('/HomeSearch') } className="p-2 rounded mt-2" style={{ backgroundColor: "#6B7280" }}>
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CustomMenu;

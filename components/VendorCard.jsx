import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTheme } from '../constants/AppTheme';
import AppCard from './AppCard';

function VendorCard({ vendor }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/vendor/${vendor.id}`)}
      style={{ marginHorizontal: 12, marginVertical: 7 }}
    >
      <AppCard>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: vendor.imageurl || vendor.img }}
          style={{ width: 82, height: 82, borderRadius: 12, backgroundColor: AppTheme.colors.surfaceAlt }}
        />

        
        <View style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: AppTheme.colors.textPrimary }}>
            {vendor.name}
          </Text>

          {vendor.description ? (
            <Text style={{ fontSize: 13, color: AppTheme.colors.textSecondary, marginTop: 4 }}>
              {vendor.description}
            </Text>
          ) : null}

          <Text style={{ fontSize: 12, color: AppTheme.colors.textSecondary, marginTop: 8 }}>
            📞 {vendor.contact}
          </Text>
          <Text style={{ fontSize: 12, color: AppTheme.colors.textSecondary }}>
            📍 {vendor.address}
          </Text>
        </View>
      </View>
      </AppCard>
    </Pressable>
  );
}

export default VendorCard;

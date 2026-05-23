import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Icon, ArrowLeftIcon } from "@/components/ui/icon";
import { AppTheme } from "../constants/AppTheme";

function AppHeader({ title, rightSlot = null }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: AppTheme.colors.headerBg,
        borderBottomWidth: 1,
        borderColor: AppTheme.colors.border,
        paddingTop: 42,
        paddingBottom: AppTheme.spacing.md,
        paddingHorizontal: AppTheme.spacing.md,
      }}
    >
      <Pressable
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace("/");
        }}
        style={{ padding: AppTheme.spacing.xs }}
      >
        <Icon as={ArrowLeftIcon} />
      </Pressable>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: AppTheme.typography.subtitle,
          fontWeight: "700",
          color: AppTheme.colors.textPrimary,
          marginRight: rightSlot ? 0 : 32,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={{ minWidth: 32, alignItems: "flex-end" }}>{rightSlot}</View>
    </View>
  );
}

export default AppHeader;

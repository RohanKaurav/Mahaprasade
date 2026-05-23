import { View } from "react-native";
import { AppTheme } from "../constants/AppTheme";

function AppCard({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: AppTheme.colors.surface,
          borderWidth: 1,
          borderColor: AppTheme.colors.border,
          borderRadius: AppTheme.radius.lg,
          padding: AppTheme.spacing.md,
          ...AppTheme.elevation.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default AppCard;

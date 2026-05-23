import { StyleSheet } from 'react-native';
import { AppTheme } from '../../constants/AppTheme';

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 6,
        backgroundColor: AppTheme.colors.background,
      },
      contentWrapper: {
        width: '100%',
        maxWidth: 600,
        alignItems: 'center',
      },
      vendorImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
      },
      vendorName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      menuCard: {
        backgroundColor: AppTheme.colors.surface,
        padding: 16,
        marginVertical: 10,
        width: '100%',
        borderRadius: AppTheme.radius.lg,
        borderWidth: 1,
        borderColor: AppTheme.colors.border,
        ...AppTheme.elevation.card,
      },
      menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: AppTheme.colors.textPrimary,
      },
      menuDetails: {
        fontSize: 14,
        marginBottom: 10,
        color: AppTheme.colors.textSecondary,
      },
      buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      addButton: {
        backgroundColor: AppTheme.colors.accentPrimary,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      circleButton: {
        backgroundColor: AppTheme.colors.surfaceAlt,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: AppTheme.colors.textPrimary,
      },
      bottomButtonContainer: {
        backgroundColor: AppTheme.colors.accentPrimary,
        padding: 14,
        marginTop: 5,
        borderRadius: AppTheme.radius.md,
        zIndex:10,
        elevation:5,        
      },
      bottomButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'      },
    });
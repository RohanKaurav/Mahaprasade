import { StyleSheet } from 'react-native';
import { AppTheme } from '../../constants/AppTheme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 ,backgroundColor: AppTheme.colors.background},
  Container_header:{flex:1,padding:10},
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  addButton: {
    backgroundColor: AppTheme.colors.accentPrimary,
    padding: 10,
    borderRadius: AppTheme.radius.sm,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  modalContainer: {
    width: '80%',
    padding: 10,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: AppTheme.colors.surfaceAlt,
    padding: 10,
    borderRadius: AppTheme.radius.sm,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  errorText: { color: 'red', fontWeight: 'bold', textAlign: 'center' },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.surface,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: AppTheme.radius.md,
},
shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
vendorImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
},
vendorInfo: {
    flex: 1,
},
vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppTheme.colors.textPrimary,
},
vendorDescription: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    marginVertical: 5,
},
vendorDetail: {
    fontSize: 12,
    color: AppTheme.colors.textSecondary,
},


});

export default styles;

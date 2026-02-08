import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function AccountsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Cards */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountName}>Checking Account</Text>
              <Text style={styles.accountType}>Bank Account</Text>
            </View>
            <Text style={styles.accountBalance}>$8,450.00</Text>
          </View>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountName}>Savings</Text>
              <Text style={styles.accountType}>Bank Account</Text>
            </View>
            <Text style={styles.accountBalance}>$15,200.00</Text>
          </View>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountName}>Credit Card</Text>
              <Text style={styles.accountType}>Credit Card</Text>
            </View>
            <Text style={[styles.accountBalance, styles.negative]}>-$1,200.00</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060a12',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountCard: {
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 13,
    color: '#64748b',
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  negative: {
    color: '#ef4444',
  },
})

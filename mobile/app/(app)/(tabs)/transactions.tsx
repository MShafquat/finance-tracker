import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function TransactionsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateGroup}>
          <Text style={styles.dateHeader}>Today</Text>

          <View style={styles.transaction}>
            <View style={styles.transactionIcon}>
              <Text>🍔</Text>
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionName}>Lunch</Text>
              <Text style={styles.transactionDetails}>Food & Dining • 2:30 PM</Text>
            </View>
            <Text style={styles.transactionAmount}>-$45.00</Text>
          </View>

          <View style={styles.transaction}>
            <View style={styles.transactionIcon}>
              <Text>☕</Text>
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionName}>Coffee</Text>
              <Text style={styles.transactionDetails}>Food & Dining • 9:15 AM</Text>
            </View>
            <Text style={styles.transactionAmount}>-$5.50</Text>
          </View>
        </View>

        <View style={styles.dateGroup}>
          <Text style={styles.dateHeader}>Yesterday</Text>

          <View style={styles.transaction}>
            <View style={styles.transactionIcon}>
              <Text>💼</Text>
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionName}>Salary</Text>
              <Text style={styles.transactionDetails}>Income • 5:00 PM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.income]}>+$3,200.00</Text>
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
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
    gap: 4,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#f1f5f9',
  },
  transactionDetails: {
    fontSize: 12,
    color: '#64748b',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  income: {
    color: '#10b981',
  },
})

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../../../store/auth'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()}{name ? `, ${name}` : ''}.</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$12,450.00</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={styles.balanceItemValue}>$8,200</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Expenses</Text>
              <Text style={styles.balanceItemValue}>$5,750</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💸</Text>
              <Text style={styles.actionText}>Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Set Budget</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            <View style={styles.transaction}>
              <View style={styles.transactionIcon}>
                <Text>🍔</Text>
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionName}>Lunch</Text>
                <Text style={styles.transactionCategory}>Food & Dining</Text>
              </View>
              <Text style={styles.transactionAmount}>-$45.00</Text>
            </View>
            <View style={styles.transaction}>
              <View style={styles.transactionIcon}>
                <Text>💼</Text>
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionName}>Salary</Text>
                <Text style={styles.transactionCategory}>Income</Text>
              </View>
              <Text style={[styles.transactionAmount, styles.income]}>+$3,200.00</Text>
            </View>
            <View style={styles.transaction}>
              <View style={styles.transactionIcon}>
                <Text>🏠</Text>
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionName}>Rent</Text>
                <Text style={styles.transactionCategory}>Housing</Text>
              </View>
              <Text style={styles.transactionAmount}>-$1,200.00</Text>
            </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  signOutText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 32,
  },
  balanceItem: {
    gap: 4,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  transactionsList: {
    gap: 12,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#f1f5f9',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  income: {
    color: '#10b981',
  },
})

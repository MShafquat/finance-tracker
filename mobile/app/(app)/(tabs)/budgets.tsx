import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function BudgetsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetName}>Food & Dining</Text>
            <Text style={styles.budgetAmount}>$350 / $500</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '70%' }]} />
          </View>
          <Text style={styles.budgetRemaining}>$150 remaining</Text>
        </View>

        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetName}>Transportation</Text>
            <Text style={styles.budgetAmount}>$120 / $200</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '60%' }]} />
          </View>
          <Text style={styles.budgetRemaining}>$80 remaining</Text>
        </View>

        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetName}>Entertainment</Text>
            <Text style={styles.budgetAmount}>$180 / $150</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, styles.overBudget, { width: '100%' }]} />
          </View>
          <Text style={[styles.budgetRemaining, styles.overBudgetText]}>$30 over budget</Text>
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
  budgetCard: {
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  overBudget: {
    backgroundColor: '#ef4444',
  },
  budgetRemaining: {
    fontSize: 12,
    color: '#64748b',
  },
  overBudgetText: {
    color: '#fca5a5',
  },
})

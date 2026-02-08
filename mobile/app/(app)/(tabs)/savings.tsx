import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function SavingsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Savings Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals</Text>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>🏖️</Text>
              <View style={styles.goalContent}>
                <Text style={styles.goalName}>Vacation Fund</Text>
                <Text style={styles.goalTarget}>Goal: $5,000</Text>
              </View>
              <Text style={styles.goalAmount}>$2,450</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '49%' }]} />
            </View>
            <Text style={styles.goalRemaining}>$2,550 remaining • 49% complete</Text>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>💻</Text>
              <View style={styles.goalContent}>
                <Text style={styles.goalName}>New Laptop</Text>
                <Text style={styles.goalTarget}>Goal: $2,000</Text>
              </View>
              <Text style={styles.goalAmount}>$1,200</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '60%' }]} />
            </View>
            <Text style={styles.goalRemaining}>$800 remaining • 60% complete</Text>
          </View>
        </View>

        {/* Smart Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>

          <View style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionIcon}>💡</Text>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionTitle}>50/30/20 Rule</Text>
                <Text style={styles.suggestionText}>
                  Based on your income, save $640/month (20%)
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.suggestionButton}>
              <Text style={styles.suggestionButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionIcon}>🎯</Text>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionTitle}>Surplus Savings</Text>
                <Text style={styles.suggestionText}>
                  You have $450 left this month. Consider saving it!
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.suggestionButton}>
              <Text style={styles.suggestionButtonText}>Save Now</Text>
            </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
    gap: 4,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  goalTarget: {
    fontSize: 12,
    color: '#64748b',
  },
  goalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
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
  goalRemaining: {
    fontSize: 12,
    color: '#64748b',
  },
  suggestionCard: {
    backgroundColor: '#0c1018',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
    gap: 4,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  suggestionText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  suggestionButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  suggestionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
})

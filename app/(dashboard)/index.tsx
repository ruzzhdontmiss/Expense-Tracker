import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Card, Surface, FAB, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';
import { Transaction } from '../../types';
import { supabase } from '../../services/supabase';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Fetch recent transactions
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setTransactions(data as Transaction[]);
      
      // Calculate totals
      calculateTotals(data as Transaction[]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  
  function calculateTotals(transactions: Transaction[]) {
    let expenses = 0;
    let income = 0;
    
    transactions.forEach(transaction => {
      if (transaction.transaction_type === 'debit') {
        expenses += transaction.amount;
      } else {
        income += transaction.amount;
      }
    });
    
    setTotalExpenses(expenses);
    setTotalIncome(income);
  }
  
  async function handleRefresh() {
    setRefreshing(true);
    await fetchData();
  }
  
  async function handleLogout() {
    await signOut();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Button mode="text" onPress={handleLogout}>Logout</Button>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.summaryContainer}>
          <Surface style={[styles.summaryCard, { backgroundColor: colors.accent }]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>₹{totalIncome.toFixed(2)}</Text>
          </Surface>
          
          <Surface style={[styles.summaryCard, { backgroundColor: colors.food }]}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryValue}>₹{totalExpenses.toFixed(2)}</Text>
          </Surface>
          
          <Surface style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={styles.summaryValue}>₹{(totalIncome - totalExpenses).toFixed(2)}</Text>
          </Surface>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Button 
              mode="text" 
              onPress={() => router.push('/transactions')}
              labelStyle={{ fontSize: 12 }}
            >
              See All
            </Button>
          </View>
          
          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : transactions.length > 0 ? (
            transactions.map(transaction => (
              <Card 
                key={transaction.id} 
                style={styles.transactionCard}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
              >
                <Card.Content style={styles.transactionContent}>
                  <View>
                    <Text style={styles.merchantName}>{transaction.merchant}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text 
                      style={[
                        styles.transactionAmount, 
                        { color: transaction.transaction_type === 'debit' ? colors.error : colors.accent }
                      ]}
                    >
                      {transaction.transaction_type === 'debit' ? '-' : '+'} ₹{transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No recent transactions</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connected Banks</Text>
            <Button 
              mode="text" 
              onPress={() => router.push('/(banks)')}
              labelStyle={{ fontSize: 12 }}
            >
              Manage
            </Button>
          </View>
          
          <Button 
            mode="outlined"
            icon="bank-plus"
            onPress={() => router.push('/(banks)/connect')}
            style={styles.bankButton}
          >
            Connect a Bank Account
          </Button>
        </View>
      </ScrollView>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/addTransaction')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.m,
    paddingTop: layout.spacing.xl,
    paddingBottom: layout.spacing.m,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: layout.spacing.xxl,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: layout.spacing.m,
  },
  summaryCard: {
    width: '30%',
    padding: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: layout.spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginTop: layout.spacing.m,
    padding: layout.spacing.m,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.medium,
    marginHorizontal: layout.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: layout.spacing.l,
  },
  transactionCard: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionCategory: {
    fontSize: 12,
    color: colors.disabled,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: layout.spacing.l,
    color: colors.disabled,
  },
  bankButton: {
    marginVertical: layout.spacing.m,
  },
  fab: {
    position: 'absolute',
    margin: layout.spacing.m,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
}); 
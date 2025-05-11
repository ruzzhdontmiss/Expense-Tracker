import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, Surface, ActivityIndicator, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';
import { Transaction } from '../../types';
import TransactionItem from '../../components/transaction/TransactionItem';

export default function TransactionsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        transaction =>
          transaction.merchant.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          transaction.description.toLowerCase().includes(query)
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
        
      if (error) throw error;
      
      setTransactions(data as Transaction[]);
      setFilteredTransactions(data as Transaction[]);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  
  async function handleRefresh() {
    setRefreshing(true);
    await fetchTransactions();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <Button 
          mode="text" 
          onPress={() => router.back()}
        >
          Back
        </Button>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search transactions"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Surface style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No transactions match your search' : 'No transactions yet'}
              </Text>
              <Button 
                mode="contained" 
                onPress={() => router.push('/addTransaction')}
                style={styles.addButton}
              >
                Add Transaction
              </Button>
            </Surface>
          }
        />
      )}
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
  searchContainer: {
    padding: layout.spacing.m,
    backgroundColor: colors.surface,
  },
  searchbar: {
    elevation: 0,
  },
  list: {
    padding: layout.spacing.m,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: layout.spacing.l,
    marginTop: layout.spacing.xl,
    alignItems: 'center',
    borderRadius: layout.borderRadius.medium,
  },
  emptyText: {
    marginBottom: layout.spacing.m,
    color: colors.disabled,
  },
  addButton: {
    marginTop: layout.spacing.m,
  },
}); 
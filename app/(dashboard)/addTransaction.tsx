import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';

const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
];

export default function AddTransactionScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [transactionType, setTransactionType] = useState('debit');
  const [error, setError] = useState('');

  async function handleAddTransaction() {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        throw new Error('You must be logged in');
      }
      
      if (!amount || !merchant || !category) {
        throw new Error('Please fill in all required fields');
      }
      
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: numAmount,
          merchant,
          description,
          category,
          transaction_type: transactionType,
          transaction_date: new Date().toISOString(),
        });
        
      if (insertError) throw insertError;
        
      // Return to dashboard on success
      router.replace('/(dashboard)');
      
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <Button 
          mode="text" 
          onPress={() => router.back()}
        >
          Cancel
        </Button>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <SegmentedButtons
            value={transactionType}
            onValueChange={setTransactionType}
            buttons={[
              { value: 'debit', label: 'Expense' },
              { value: 'credit', label: 'Income' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <TextInput
            label="Amount (₹)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Merchant/Source"
            value={merchant}
            onChangeText={setMerchant}
            style={styles.input}
          />
          
          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.input}
          />
          
          <Text style={styles.categoryLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <Button
                key={cat}
                mode={category === cat ? "contained" : "outlined"}
                onPress={() => setCategory(cat)}
                style={styles.categoryButton}
                labelStyle={{ fontSize: 12 }}
              >
                {cat}
              </Button>
            ))}
          </View>
          
          <Button
            mode="contained"
            onPress={handleAddTransaction}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Add Transaction
          </Button>
        </Surface>
      </ScrollView>
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
    padding: layout.spacing.m,
  },
  form: {
    padding: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
  },
  errorText: {
    color: colors.error,
    marginBottom: layout.spacing.m,
    textAlign: 'center',
  },
  segmentedButtons: {
    marginBottom: layout.spacing.m,
  },
  input: {
    marginBottom: layout.spacing.m,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: layout.spacing.s,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: layout.spacing.l,
  },
  categoryButton: {
    margin: layout.spacing.xs,
  },
  submitButton: {
    marginTop: layout.spacing.m,
  },
}); 
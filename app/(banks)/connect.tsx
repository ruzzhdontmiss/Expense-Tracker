import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';

export default function ConnectBankScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');

  async function handleConnectBank() {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        throw new Error('You must be logged in');
      }
      
      if (!bankName || !accountNumber) {
        throw new Error('Please fill in all required fields');
      }

      // In a real app, this would actually connect to a banking API
      // Here we'll just save the connection info
      const { error: insertError } = await supabase
        .from('bank_connections')
        .insert({
          user_id: user.id,
          bank_name: bankName,
          account_number: accountNumber,
          // These would be returned from the bank API
          finvu_connection_id: `finvu-${Math.random().toString(36).substring(2, 10)}`,
          access_token: `token-${Math.random().toString(36).substring(2, 15)}`,
        });
        
      if (insertError) throw insertError;
        
      // Return to dashboard on success
      router.replace('/(banks)');
      
    } catch (error: any) {
      console.error('Error connecting bank:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect Bank Account</Text>
        <Button 
          mode="text" 
          onPress={() => router.back()}
        >
          Cancel
        </Button>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.form}>
          <Text style={styles.description}>
            Link your bank account to automatically import transactions.
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TextInput
            label="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            style={styles.input}
          />
          
          <TextInput
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              By connecting your account, you authorize Expense Management to access your financial data. 
              Your credentials are securely handled and never stored on our servers.
            </Text>
          </View>
          
          <Button
            mode="contained"
            onPress={handleConnectBank}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Connect Account
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
  description: {
    marginBottom: layout.spacing.l,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: layout.spacing.m,
    textAlign: 'center',
  },
  input: {
    marginBottom: layout.spacing.m,
  },
  disclaimer: {
    marginVertical: layout.spacing.l,
    padding: layout.spacing.m,
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.medium,
  },
  disclaimerText: {
    fontSize: 12,
    opacity: 0.7,
  },
  submitButton: {
    marginTop: layout.spacing.m,
  },
}); 
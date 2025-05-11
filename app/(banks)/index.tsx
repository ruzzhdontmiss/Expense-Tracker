import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Card, Surface, ActivityIndicator, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';
import { BankConnection } from '../../types';

export default function BanksScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banks, setBanks] = useState<BankConnection[]>([]);

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('bank_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBanks(data as BankConnection[]);
      
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  
  async function handleRefresh() {
    setRefreshing(true);
    await fetchBanks();
  }
  
  async function handleDisconnect(bankId: string) {
    try {
      const { error } = await supabase
        .from('bank_connections')
        .delete()
        .eq('id', bankId);
        
      if (error) throw error;
      
      // Refresh the list
      fetchBanks();
      
    } catch (error) {
      console.error('Error disconnecting bank:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connected Banks</Text>
        <Button 
          mode="text" 
          onPress={() => router.back()}
        >
          Back
        </Button>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Surface style={styles.section}>
          <Text style={styles.sectionDescription}>
            Manage your connected bank accounts. Connecting your accounts helps you track expenses automatically.
          </Text>
          
          <Button 
            mode="contained" 
            icon="bank-plus"
            onPress={() => router.push('/(banks)/connect')}
            style={styles.addButton}
          >
            Connect New Bank
          </Button>
        </Surface>
        
        <View style={styles.banksList}>
          <Text style={styles.sectionTitle}>Your Connected Banks</Text>
          
          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : banks.length > 0 ? (
            banks.map(bank => (
              <Card key={bank.id} style={styles.bankCard}>
                <Card.Content style={styles.bankContent}>
                  <View>
                    <Text style={styles.bankName}>{bank.bank_name}</Text>
                    <Text style={styles.accountNumber}>
                      Account ending in {bank.account_number.slice(-4)}
                    </Text>
                    <Text style={styles.connectedDate}>
                      Connected on {new Date(bank.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <IconButton
                    icon="link-off"
                    size={20}
                    onPress={() => handleDisconnect(bank.id)}
                    mode="contained-tonal"
                    style={styles.disconnectButton}
                  />
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyMessage}>
              No bank accounts connected yet. Connect your first bank to start tracking expenses!
            </Text>
          )}
        </View>
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
  section: {
    padding: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    marginBottom: layout.spacing.l,
  },
  sectionDescription: {
    marginBottom: layout.spacing.m,
  },
  addButton: {
    marginTop: layout.spacing.s,
  },
  banksList: {
    marginTop: layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: layout.spacing.m,
  },
  loader: {
    marginVertical: layout.spacing.l,
  },
  bankCard: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
  },
  bankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountNumber: {
    fontSize: 14,
    marginTop: 4,
  },
  connectedDate: {
    fontSize: 12,
    color: colors.disabled,
    marginTop: 2,
  },
  disconnectButton: {
    margin: 0,
  },
  emptyMessage: {
    textAlign: 'center',
    padding: layout.spacing.l,
    color: colors.disabled,
  },
}); 
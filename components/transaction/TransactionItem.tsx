import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { Transaction } from '../../types';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.transaction_type === 'debit';
  
  const handlePress = () => {
    router.push(`/transaction/${transaction.id}`);
  };
  
  // Format date
  const transactionDate = new Date(transaction.transaction_date);
  const formattedDate = transactionDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  });
  
  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.merchantName}>{transaction.merchant}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.category}>{transaction.category}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Text 
            style={[
              styles.amount, 
              { color: isExpense ? colors.error : colors.accent }
            ]}
          >
            {isExpense ? '-' : '+'} ₹{transaction.amount.toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: colors.disabled,
    marginRight: layout.spacing.s,
  },
  date: {
    fontSize: 12,
    color: colors.disabled,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
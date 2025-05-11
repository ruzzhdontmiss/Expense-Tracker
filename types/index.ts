export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  spending_limit_monthly: number | null;
  spending_limit_weekly: number | null;
}

export interface BankConnection {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  finvu_connection_id: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  bank_connection_id: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
  merchant: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface UserCategory {
  id: string;
  user_id: string;
  category_id: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: 'weekly_limit' | 'monthly_limit' | 'high_value';
  threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 
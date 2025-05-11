import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://qelgqooecurildbtkmzm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbGdxb29lY3VyaWxkYnRrbXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTc5MTgsImV4cCI6MjA2MDQ5MzkxOH0.NDZN8-oFBxrMgdI3a6ldn4LBURqQv__h3gU8agYWEW8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 
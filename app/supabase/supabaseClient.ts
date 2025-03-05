import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
// Utility functions for auth

// Get the current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Refresh session
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  return { session: data.session, user: data.user, error };
};

// Set session
export const setSession = async (access_token: string, refresh_token: string) => {
  return await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
};

// Listen for auth state changes
export const onAuthStateChange = (callback: Function) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

export default supabase;
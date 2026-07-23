import { supabase } from './supabase';

export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const onAuthChange = (callback: (isLoggedIn: boolean) => void) => {
  return supabase.auth.onAuthStateChange((event) => {
    callback(event === 'SIGNED_IN');
  });
};

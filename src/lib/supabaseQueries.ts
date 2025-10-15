import { supabase } from "./supabase";

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return error;
};

export const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password });
  return error;
};

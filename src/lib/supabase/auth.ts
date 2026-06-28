import { supabase } from "./client";

type AuthCredentials = {
  email: string;
  password: string;
  fullName?: string;
};

export async function signUpWithEmail({ email, password, fullName }: AuthCredentials) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signInWithEmail({ email, password }: AuthCredentials) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/#/app`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

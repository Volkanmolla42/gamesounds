"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState("free"); // 'free' or 'premium'

  useEffect(() => {
    // Check current session information
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await getUserProfile(session.user.id);
      }

      setLoading(false);
    };

    checkUser();

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        await getUserProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setCredits(0);
        setSubscription("free");
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Get user profile
  const getUserProfile = async (userId) => {
    try {
      if (!userId) {
        console.log("No user ID provided to getUserProfile");
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // If the error is because the profile doesn't exist (404), create a new one
        if (error.code === "PGRST116") {
          console.log("User profile not found, creating new profile");
          return await createUserProfile(userId);
        }

        // Otherwise, it's a different error
        throw error;
      }

      if (data) {
        setCredits(data.remaining_credits || 0);
        setSubscription(data.subscription_type || "free");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Provide a fallback for the user to have some credits
      setCredits(5);
      setSubscription("free");
    }
  };

  // Create new user profile
  const createUserProfile = async (userId) => {
    try {
      if (!userId) {
        console.log("No user ID provided to createUserProfile");
        return;
      }

      // Create 5 credits for new free users
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: userId,
            subscription_type: "free",
            remaining_credits: 5,
          },
        ])
        .select();

      if (error) throw error;

      // Set profile
      setCredits(5);
      setSubscription("free");
      return data;
    } catch (error) {
      console.error("Error creating user profile:", error);
      // Provide a fallback
      setCredits(5);
      setSubscription("free");
      return null;
    }
  };

  // Use credit
  const spendCredit = async () => {
    try {
      if (!user) return false;
      if (credits <= 0) return false;

      const { data, error } = await supabase
        .from("user_profiles")
        .update({ remaining_credits: credits - 1 })
        .eq("user_id", user.id);

      if (error) throw error;

      setCredits((prev) => prev - 1);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      return false;
    }
  };

  // Upgrade to premium
  const upgradeToPremium = async () => {
    return false; // Remove this line when implementing the upgrade process
    try {
      if (!user) return false;

      // NOTE: A real payment process should be integrated here (Stripe etc.)
      // In this example, we are only changing the user type

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          subscription_type: "premium",
          remaining_credits: 100, // Premium users get 100 credits
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSubscription("premium");
      setCredits(100);
      return true;
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      return false;
    }
  };

  // Sign in with email
  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign up with email
  const signUpWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    credits,
    subscription,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    spendCredit,
    upgradeToPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

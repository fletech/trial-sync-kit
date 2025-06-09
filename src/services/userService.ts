import { supabase } from "../lib/supabase";

// NEW: Auth result types for Supabase
export interface AuthResult {
  user?: any;
  session?: any;
  error?: any;
}

// User types
export interface User {
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

// Onboarding status
export interface OnboardingStatus {
  completed: boolean;
  currentStep?: number;
  role?: string;
  userInfo?: {
    firstName: string;
    lastName: string;
  };
  studyInfo?: {
    name: string;
    location: string;
    sponsor: string;
    phase?: string;
  };
  team?: Array<{ email: string; role: string }>;
}

// Auth status
export interface AuthStatus {
  isLoggedIn: boolean;
  rememberMe: boolean;
  lastLogin?: string;
}

const STORAGE_KEYS = {
  USER: "themison_user",
  ONBOARDING: "themison_onboarding",
  AUTH: "themison_auth",
};

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  // Emit custom event to notify components of user data change
  window.dispatchEvent(new CustomEvent("userDataUpdated"));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Onboarding functions
export const saveOnboardingStatus = (status: OnboardingStatus): void => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(status));
};

export const getOnboardingStatus = (): OnboardingStatus | null => {
  const onboardingData = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
  return onboardingData ? JSON.parse(onboardingData) : null;
};

export const isOnboardingCompleted = (): boolean => {
  const status = getOnboardingStatus();
  return status?.completed || false;
};

export const updateOnboardingStep = (step: number, data?: any): void => {
  const currentStatus = getOnboardingStatus() || { completed: false };

  let updatedStatus: OnboardingStatus = {
    ...currentStatus,
    currentStep: step,
  };

  // Update specific step data
  if (data) {
    if (step === 1) {
      if (typeof data === "string") {
        // Legacy support for old role-only format
        updatedStatus.role = data;
      } else if (typeof data === "object" && data.role) {
        // New format with user info and role
        updatedStatus.role = data.role;
        updatedStatus.userInfo = data.userInfo;
      }
    } else if (step === 2 && typeof data === "object") {
      updatedStatus.studyInfo = data;
    } else if (step === 3 && Array.isArray(data)) {
      updatedStatus.team = data;
    }
  }

  // Mark as completed when reaching the final step
  if (step === 3) {
    updatedStatus.completed = true;
  }

  saveOnboardingStatus(updatedStatus);
};

// Auth functions
export const saveAuthStatus = (status: AuthStatus): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(status));
};

export const getAuthStatus = (): AuthStatus | null => {
  const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
  return authData ? JSON.parse(authData) : null;
};

// NEW: Supabase Auth Functions
export const signUp = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || null,
      },
    },
  });

  if (data.user && !error) {
    // Use existing localStorage functions for preferences
    login(email, false);
  }

  return { user: data.user, session: data.session, error };
};

export const signIn = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.user && !error) {
    // Use existing login function to maintain compatibility
    login(email, rememberMe);
  }

  return { user: data.user, session: data.session, error };
};

export const resetPassword = async (
  email: string
): Promise<{ error?: any }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { error };
};

export const updatePassword = async (
  newPassword: string
): Promise<{ user?: any; error?: any }> => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { user: data?.user, error };
};

// Enhanced auth status check
export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    // Check local storage first (for quick UI updates)
    const localStatus = getAuthStatus()?.isLoggedIn;

    // Check Supabase session for real auth state
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // If there's a session but local storage says logged out, sync them
    if (session && !localStatus) {
      login(session.user.email, getAuthStatus()?.rememberMe || false);
      return true;
    }

    // If no session but local storage says logged in, clear local storage
    if (!session && localStatus) {
      logout();
      return false;
    }

    return !!session;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
};

export const login = (email: string, rememberMe: boolean = false): void => {
  // Save auth status
  saveAuthStatus({
    isLoggedIn: true,
    rememberMe,
    lastLogin: new Date().toISOString(),
  });

  // Save user with minimal info - in a real app we'd get more user data from the backend
  saveUser({ email });
};

// Enhanced logout function
export const logout = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out from Supabase:", error);
  }

  // Existing localStorage logic
  const authStatus = getAuthStatus();
  if (!authStatus?.rememberMe) {
    clearUser();
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } else {
    // Just update the logged in status
    saveAuthStatus({
      ...authStatus,
      isLoggedIn: false,
    });
  }
};

// Get current user from Supabase
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { user: null, error };
  }
};

// Initialize auth state listener
export const initAuthListener = () => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      // Update local storage when user signs in
      const rememberMe = getAuthStatus()?.rememberMe || false;
      login(session.user.email, rememberMe);
    } else if (event === "SIGNED_OUT") {
      // Update local storage when user signs out
      const authStatus = getAuthStatus();
      if (!authStatus?.rememberMe) {
        clearUser();
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      } else {
        saveAuthStatus({
          ...authStatus,
          isLoggedIn: false,
        });
      }
    }
  });
};

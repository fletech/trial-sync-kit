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
  avatar?: string;
}

// NEW: Database entity interfaces
export interface ProfileData {
  first_name: string;
  last_name: string;
  onboarding_completed?: boolean; // Optional since it's auto-generated
}

export interface TrialData {
  name: string;
  location: string;
  sponsor: string;
  phase: string;
}

export interface TeamMemberData {
  name: string;
  email: string;
  role: string;
}

export interface OnboardingData {
  profile: ProfileData;
  trial: TrialData;
  teamMembers: TeamMemberData[];
  currentUserRole: string; // Add this to track the role of the current user
}

// Onboarding status
export interface OnboardingStatus {
  completed: boolean;
  currentStep?: number;
  role?: string;
  organizationName?: string;
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

export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    // Check if user has completed onboarding by checking the explicit boolean field
    const { profile } = await getUserFromDB();

    // Simple and reliable: just check the onboarding_completed boolean
    return profile?.onboarding_completed || false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
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
        // New format with user info, role, and organizationName
        updatedStatus.role = data.role;
        updatedStatus.userInfo = data.userInfo;
        if (data.organizationName) {
          updatedStatus.organizationName = data.organizationName;
        }
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
    // Update auth state after successful signup
    updateAuthState(email, false);
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
    // Update auth state after successful login
    updateAuthState(email, rememberMe);
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
      updateAuthState(session.user.email, getAuthStatus()?.rememberMe || false);
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

/**
 * Internal function to update auth state in localStorage
 * Used when we already have a valid session but need to sync localStorage
 */
const updateAuthState = async (email: string, rememberMe: boolean) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Error getting user:", authError);
    return;
  }

  // Get user profile from database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return;
  }

  // Create user object without role (role comes from team_members now)
  const userObject: User = {
    email: user.email,
    name: profile.first_name
      ? `${profile.first_name} ${profile.last_name || ""}`.trim()
      : user.email.split("@")[0],
  };

  // Save user and auth status
  saveUser(userObject);
  saveAuthStatus({
    isLoggedIn: true,
    rememberMe,
    lastLogin: new Date().toISOString(),
  });
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    // Create user object without role
    const user = {
      email: data.user.email,
      name: profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`.trim()
        : data.user.email?.split("@")[0],
    };

    saveUser(user);
    saveAuthStatus({
      isLoggedIn: true,
      rememberMe,
      lastLogin: new Date().toISOString(),
    });

    await updateAuthState(email, rememberMe);

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error("Login error:", error);
    return { error };
  }
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
      updateAuthState(session.user.email, rememberMe);
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

// NEW: Database functions for onboarding flow

/**
 * Check if user is invited (exists in team_members table)
 */
export const isUserInvited = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    const { data: teamMember, error: teamError } = await supabase
      .from("team_members")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    return !teamError && !!teamMember;
  } catch (error) {
    console.error("Error checking if user is invited:", error);
    return false;
  }
};

/**
 * Get the role of the invited user from team_members table
 */
export const getInvitedUserRole = async (): Promise<string | null> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: teamMember, error: teamError } = await supabase
      .from("team_members")
      .select("role")
      .eq("email", user.email)
      .maybeSingle();

    if (teamError || !teamMember) {
      return null;
    }

    return teamMember.role;
  } catch (error) {
    console.error("Error getting invited user role:", error);
    return null;
  }
};

/**
 * Get user profile from database
 */
export const getUserFromDB = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, profile: null, error: authError };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile, error: profileError };
  } catch (error) {
    console.error("Error getting user from DB:", error);
    return { user: null, profile: null, error };
  }
};

/**
 * Save complete onboarding data to database
 * This function handles the final step of onboarding by saving:
 * - User profile information
 * - Trial data
 * - Team member invitations
 */
export const saveCompleteOnboarding = async (data: OnboardingData) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Get onboarding data to check if organization creation is needed
    const onboardingStatus = getOnboardingStatus();
    const isPrincipalInvestigator =
      data.currentUserRole === "Principal investigator";
    const organizationName = onboardingStatus?.organizationName;

    // Debug logging
    console.log("Debug - saveCompleteOnboarding:", {
      isPrincipalInvestigator,
      organizationName,
      onboardingStatus,
      role: data.currentUserRole,
    });

    let teamId: string | null = null;

    // 1. Update user profile (no role here anymore)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: data.profile.first_name,
        last_name: data.profile.last_name,
        onboarding_completed: true, // Mark onboarding as completed
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`Profile update failed: ${profileError.message}`);
    }

    // 2. Create Organization and Team (only for Principal Investigator)
    if (isPrincipalInvestigator && organizationName) {
      // Create Organization
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: organizationName,
          created_by: user.id,
        })
        .select()
        .single();

      if (orgError) {
        throw new Error(`Organization creation failed: ${orgError.message}`);
      }

      // Create Team for this organization
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: `${organizationName} Team`, // Default team name
          organization_id: orgData.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (teamError) {
        throw new Error(`Team creation failed: ${teamError.message}`);
      }

      teamId = teamData.id;
    }

    // 3. Create trial
    const { data: trialData, error: trialError } = await supabase
      .from("trials")
      .insert({
        name: data.trial.name,
        location: data.trial.location,
        sponsor: data.trial.sponsor,
        phase: data.trial.phase,
        created_by: user.id,
        is_new: true,
        ...(teamId && { team_id: teamId }),
      })
      .select()
      .single();

    if (trialError) {
      throw new Error(`Trial creation failed: ${trialError.message}`);
    }

    // 4. Handle team members (simplified thanks to DB trigger)

    // Check if current user already exists in team_members (invited or self-created)
    const { data: existingTeamMember, error: teamMemberCheckError } =
      await supabase
        .from("team_members")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

    if (teamMemberCheckError) {
      throw new Error(
        `Error checking existing team member: ${teamMemberCheckError.message}`
      );
    }

    // Only create team member record if user doesn't exist yet
    // (if they were invited, the trigger already linked them when profile was created)
    if (!existingTeamMember) {
      const { error: insertCurrentUserError } = await supabase
        .from("team_members")
        .insert({
          name: `${data.profile.first_name} ${data.profile.last_name}`,
          email: user.email,
          role: data.currentUserRole, // Use currentUserRole instead of profile role
          invited_by: user.id, // Self-invited
          profile_id: user.id, // Already linked since it's the current user
          ...(teamId && { team_id: teamId }),
        });

      if (insertCurrentUserError) {
        throw new Error(
          `Error creating team member record: ${insertCurrentUserError.message}`
        );
      }
    }

    // Add any new invited team members (constraint prevents duplicates)
    if (data.teamMembers && data.teamMembers.length > 0) {
      const invitedMembers = data.teamMembers.map((member) => ({
        name: member.name || member.email.split("@")[0], // Use email prefix if no name
        email: member.email,
        role: member.role,
        invited_by: user.id,
        profile_id: null, // Will be linked automatically when user signs up (via trigger)
        ...(teamId && { team_id: teamId }),
      }));

      // Insert with graceful handling of duplicate constraint violations
      const { error: teamError } = await supabase
        .from("team_members")
        .insert(invitedMembers);

      // If error is due to unique constraint violation, that's expected for duplicates
      if (
        teamError &&
        !teamError.message.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        throw new Error(`Team member creation failed: ${teamError.message}`);
      }
    }

    return {
      success: true,
      trial: trialData,
      message: "Onboarding completed successfully!",
    };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Complete simplified onboarding for invited users
 * Only updates name and marks onboarding as completed
 */
export const completeInvitedUserOnboarding = async (
  firstName: string,
  lastName: string
) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Update user profile with name and mark onboarding complete
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`Profile update failed: ${profileError.message}`);
    }

    // Update team member name
    const { error: teamMemberError } = await supabase
      .from("team_members")
      .update({
        name: `${firstName} ${lastName}`,
      })
      .eq("email", user.email);

    if (teamMemberError) {
      throw new Error(`Team member update failed: ${teamMemberError.message}`);
    }

    return {
      success: true,
      message: "Welcome to the team!",
    };
  } catch (error) {
    console.error("Error completing invited user onboarding:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};


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
  studyInfo?: {
    name: string;
    location: string;
    sponsor: string;
    phase: string;
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
  USER: 'themison_user',
  ONBOARDING: 'themison_onboarding',
  AUTH: 'themison_auth'
};

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
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
    currentStep: step
  };
  
  // Update specific step data
  if (data) {
    if (step === 1 && typeof data === 'string') {
      updatedStatus.role = data;
    } else if (step === 2 && typeof data === 'object') {
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

export const isUserLoggedIn = (): boolean => {
  const status = getAuthStatus();
  return status?.isLoggedIn || false;
};

export const login = (email: string, rememberMe: boolean = false): void => {
  // Save auth status
  saveAuthStatus({
    isLoggedIn: true,
    rememberMe,
    lastLogin: new Date().toISOString()
  });
  
  // Save user with minimal info - in a real app we'd get more user data from the backend
  saveUser({ email });
};

export const logout = (): void => {
  const authStatus = getAuthStatus();
  
  // If remember me is not set, clear everything
  if (!authStatus?.rememberMe) {
    clearUser();
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } else {
    // Just update the logged in status
    saveAuthStatus({
      ...authStatus,
      isLoggedIn: false
    });
  }
};

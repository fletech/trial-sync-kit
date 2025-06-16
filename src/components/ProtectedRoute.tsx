import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isOnboardingCompleted } from "@/services/userService";
import storage from "@/services/storage";
import { useState, useEffect } from "react";

// Loading component
const AuthLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// A protected route wrapper component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// A route that checks if onboarding is completed
export const OnboardingCheck = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null
  );
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isLoggedIn && !isLoading) {
        try {
          const completed = await isOnboardingCompleted();
          setOnboardingComplete(completed);
        } catch (error) {
          console.error("Error checking onboarding:", error);
          setOnboardingComplete(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [isLoggedIn, isLoading]);

  if (isLoading || checkingOnboarding) {
    return <AuthLoading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingComplete === false) {
    return <Navigate to="/onboarding/step1" replace />;
  }

  // Initialize user data if this is their first time accessing the dashboard
  if (!storage.isUserInitialized()) {
    storage.initializeNewUser();
  }

  return <>{children}</>;
};

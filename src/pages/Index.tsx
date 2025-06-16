import { Link, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  isUserLoggedIn,
  isOnboardingCompleted,
  isUserInvited,
  getInvitedUserRole,
} from "@/services/userService";
import { useState, useEffect } from "react";

const Index = () => {
  const [authState, setAuthState] = useState<{
    isLoggedIn: boolean | null;
    onboardingCompleted: boolean | null;
    isInvited: boolean | null;
    invitedRole: string | null;
    isLoading: boolean;
  }>({
    isLoggedIn: null,
    onboardingCompleted: null,
    isInvited: null,
    invitedRole: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const loggedIn = await isUserLoggedIn();

        if (loggedIn) {
          const onboardingComplete = await isOnboardingCompleted();
          const userInvited = await isUserInvited();
          const invitedRole = userInvited ? await getInvitedUserRole() : null;

          setAuthState({
            isLoggedIn: true,
            onboardingCompleted: onboardingComplete,
            isInvited: userInvited,
            invitedRole: invitedRole,
            isLoading: false,
          });
        } else {
          setAuthState({
            isLoggedIn: false,
            onboardingCompleted: null,
            isInvited: null,
            invitedRole: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setAuthState({
          isLoggedIn: false,
          onboardingCompleted: null,
          isInvited: null,
          invitedRole: null,
          isLoading: false,
        });
      }
    };

    checkAuthState();
  }, []);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If logged in, redirect based on user type and onboarding status
  if (authState.isLoggedIn) {
    if (authState.onboardingCompleted) {
      // User has completed onboarding, go to dashboard
      return <Navigate to="/dashboard" replace />;
    } else if (
      authState.isInvited &&
      authState.invitedRole !== "Principal investigator"
    ) {
      // User is invited and NOT a Principal investigator, use simplified onboarding
      return <Navigate to="/onboarding/invited" replace />;
    } else {
      // Regular user or invited Principal investigator, use full onboarding
      return <Navigate to="/onboarding/step1" replace />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl px-4 py-8 text-center">
        <h1 className="text-4xl font-bold tracking-wider mb-4 text-primary uppercase">
          Themison
        </h1>
        <p className="text-xl text-themison-gray mb-8">
          Modern clinical trial document assistant platform
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to="/login"
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded transition-colors font-medium"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center border border-primary text-primary hover:bg-gray-50 px-6 py-3 rounded transition-colors font-medium"
          >
            Create an account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

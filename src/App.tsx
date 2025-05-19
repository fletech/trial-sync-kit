
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isUserLoggedIn, isOnboardingCompleted } from "@/services/userService";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Components
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { PasswordReset } from "./features/auth/components/PasswordReset";
import { SuccessScreen } from "./features/auth/components/SuccessScreen";

// Onboarding Components
import { StepOne } from "./features/onboarding/components/StepOne";
import { StepTwo } from "./features/onboarding/components/StepTwo";
import { StepThree } from "./features/onboarding/components/StepThree";
import OnboardingComplete from "./features/onboarding/components/OnboardingComplete";

// Dashboard Components
import { Dashboard } from "./features/dashboard/components/Dashboard";

const queryClient = new QueryClient();

// A protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = isUserLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// A route that checks if onboarding is completed
const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const onboardingComplete = isOnboardingCompleted();
  const isLoggedIn = isUserLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!onboardingComplete) {
    return <Navigate to="/onboarding/step1" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/register/success" element={
            <SuccessScreen 
              title="You've created a new account"
              message="You can now sign in using your new account"
              ctaText="Sign in with your new account"
              ctaHref="/login"
            />
          } />
          
          {/* Onboarding Routes - protected by login */}
          <Route path="/onboarding/step1" element={
            <ProtectedRoute>
              <StepOne />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/step2" element={
            <ProtectedRoute>
              <StepTwo />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/step3" element={
            <ProtectedRoute>
              <StepThree />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/complete" element={
            <ProtectedRoute>
              <OnboardingComplete />
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes - protected by login and completed onboarding */}
          <Route path="/dashboard" element={
            <OnboardingCheck>
              <Dashboard />
            </OnboardingCheck>
          } />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

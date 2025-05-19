
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/step1" element={<StepOne />} />
          <Route path="/onboarding/step2" element={<StepTwo />} />
          <Route path="/onboarding/step3" element={<StepThree />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

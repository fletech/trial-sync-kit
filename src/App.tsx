import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { runDataMigrations } from "@/utils/dataMigration";
import { TrialProvider } from "@/contexts/TrialContext";
import { ProtectedRoute, OnboardingCheck } from "@/components/ProtectedRoute";

import { DevTools } from "@/components/DevTools";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { PasswordResetPage } from "./pages/auth/PasswordResetPage";
import { SuccessScreenPage } from "./pages/auth/SuccessScreenPage";

// Onboarding Pages
import { StepOnePage } from "./pages/onboarding/StepOnePage";
import { StepTwoPage } from "./pages/onboarding/StepTwoPage";
import { StepThreePage } from "./pages/onboarding/StepThreePage";
import { OnboardingCompletePage } from "./pages/onboarding/OnboardingCompletePage";

// Dashboard Pages
import { DashboardPage } from "./pages/DashboardPage";
import { TaskManagementPage } from "./pages/TaskManagementPage";
import TrialsPage from "./pages/TrialsPage";
import OrganizationPage from "./pages/OrganizationPage";
import NotificationsPage from "./pages/NotificationsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import TrialDetailPage from "./pages/TrialDetailPage";

const queryClient = new QueryClient();

const App = () => {
  // Run data migrations on app startup
  runDataMigrations();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DevTools />
        <TrialProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Index />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route
                path="/register/success"
                element={
                  <SuccessScreenPage
                    title="You've created a new account"
                    message="You can now sign in using your new account"
                    ctaText="Sign in with your new account"
                    ctaHref="/login"
                  />
                }
              />

              {/* Onboarding Routes - protected by login */}
              <Route
                path="/onboarding/step1"
                element={
                  <ProtectedRoute>
                    <StepOnePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/step2"
                element={
                  <ProtectedRoute>
                    <StepTwoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/step3"
                element={
                  <ProtectedRoute>
                    <StepThreePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/complete"
                element={
                  <ProtectedRoute>
                    <OnboardingCompletePage />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Routes - protected by login and completed onboarding */}
              <Route
                path="/dashboard"
                element={
                  <OnboardingCheck>
                    <DashboardPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials"
                element={
                  <OnboardingCheck>
                    <TrialsPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/organisation"
                element={
                  <OnboardingCheck>
                    <OrganizationPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/notifications"
                element={
                  <OnboardingCheck>
                    <NotificationsPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/integrations"
                element={
                  <OnboardingCheck>
                    <IntegrationsPage />
                  </OnboardingCheck>
                }
              />

              {/* Task Management Route */}
              <Route path="/task-manager" element={<TaskManagementPage />} />

              {/* Trial Detail Routes */}
              <Route
                path="/trials/:trialId"
                element={
                  <OnboardingCheck>
                    <TrialDetailPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials/:trialId/task-manager"
                element={
                  <OnboardingCheck>
                    <TaskManagementPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials/:trialId/document-assistant"
                element={
                  <OnboardingCheck>
                    <TrialDetailPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials/:trialId/team-roles"
                element={
                  <OnboardingCheck>
                    <TrialDetailPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials/:trialId/notifications"
                element={
                  <OnboardingCheck>
                    <TrialDetailPage />
                  </OnboardingCheck>
                }
              />
              <Route
                path="/trials/:trialId/integrations"
                element={
                  <OnboardingCheck>
                    <TrialDetailPage />
                  </OnboardingCheck>
                }
              />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TrialProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

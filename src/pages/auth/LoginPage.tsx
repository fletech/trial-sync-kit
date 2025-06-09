import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  signIn,
  isUserLoggedIn,
  isOnboardingCompleted,
} from "@/services/userService";
import { FormField } from "@/components/ui/form-field";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check on component mount if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        const redirectTo = isOnboardingCompleted()
          ? "/dashboard"
          : "/onboarding/step1";
        navigate(redirectTo, { replace: true });
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use Supabase auth instead of mock login
      const result = await signIn(email, password, rememberMe);

      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login successful",
        description: "Redirecting...",
        variant: "success",
      });

      // Navigate to onboarding if not completed, otherwise to dashboard
      const redirectPath = isOnboardingCompleted()
        ? "/dashboard"
        : "/onboarding/step1";
      navigate(redirectPath);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••••••"
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              to="/reset-password"
              className="text-primary hover:text-primary-hover"
            >
              Forgot password
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Continue"}
        </button>

        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-primary hover:text-primary-hover text-sm"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export { LoginPage };

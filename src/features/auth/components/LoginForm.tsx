
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { login, isUserLoggedIn, isOnboardingCompleted } from '@/services/userService';
import { FormField } from '@/components/ui/form-field';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check on component mount if user is already logged in
  useEffect(() => {
    if (isUserLoggedIn()) {
      const redirectTo = isOnboardingCompleted() ? '/dashboard' : '/onboarding/step1';
      navigate(redirectTo, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, we would validate credentials with a backend
    // For now, we'll simulate a successful login
    login(email, rememberMe);
    
    toast({
      title: "Login successful",
      description: "Redirecting...",
    });
    
    // Navigate to onboarding if not completed, otherwise to dashboard
    const redirectPath = isOnboardingCompleted() ? '/dashboard' : '/onboarding/step1';
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-primary">Themison</h1>
        </div>
        
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
              <Link to="/reset-password" className="text-primary hover:text-primary-hover">
                Forgot password
              </Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium"
          >
            Continue
          </button>
          
          <div className="text-center mt-4">
            <Link to="/register" className="text-primary hover:text-primary-hover text-sm">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { LoginForm };

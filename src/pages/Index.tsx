
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { isUserLoggedIn, isOnboardingCompleted } from '@/services/userService';

const Index = () => {
  // Check if user is already logged in
  const isLoggedIn = isUserLoggedIn();
  
  // If logged in, redirect to dashboard or onboarding based on completion status
  if (isLoggedIn) {
    const redirectTo = isOnboardingCompleted() ? '/dashboard' : '/onboarding/step1';
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl px-4 py-8 text-center">
        <h1 className="text-4xl font-bold tracking-wider mb-4 text-primary uppercase">Themison</h1>
        <p className="text-xl text-themison-gray mb-8">Modern clinical trial document assistant platform</p>
        
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

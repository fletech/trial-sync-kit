
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would integrate with Supabase auth here
    setSubmitted(true);
    toast({
      title: "Password reset link sent",
      description: "Please check your email for further instructions",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-primary">Themison</h1>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-2">Reset your password</h2>
        <p className="text-center text-themison-gray mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium"
            >
              Send reset link
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-primary hover:text-primary-hover text-sm">
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-themison-success" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check your email</h3>
            <p className="text-themison-gray mb-6">
              We've sent a password reset link to {email}
            </p>
            <Link 
              to="/login" 
              className="text-primary hover:text-primary-hover"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export { PasswordReset };

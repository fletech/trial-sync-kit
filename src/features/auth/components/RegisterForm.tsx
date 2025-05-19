
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Password validation states
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationClass, setValidationClass] = useState('');

  useEffect(() => {
    // Check password validations
    const newValidations = {
      length: password.length >= 8 && password.length <= 64,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    setValidations(newValidations);
    
    // Calculate password strength (0-5)
    const strength = Object.values(newValidations).filter(Boolean).length;
    setPasswordStrength(strength);
    
    // Set validation class for input styling
    if (password.length === 0) {
      setValidationClass('');
    } else if (strength >= 4) {
      setValidationClass('border-themison-success ring-1 ring-themison-success');
    } else if (strength > 0) {
      setValidationClass('border-destructive ring-1 ring-destructive');
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordStrength < 4) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, we would integrate with Supabase auth here
    toast({
      title: "Account created successfully",
      description: "You can now sign in with your credentials",
    });
    
    // Simulate navigation to success page
    window.location.href = '/register/success';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-primary">Themison</h1>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6">Create an account</h2>
        
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
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className={`w-full px-4 py-3 border rounded focus:outline-none pr-10 ${validationClass}`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {password.length > 0 && (
              <div className="mt-3">
                {passwordStrength > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-themison-gray flex justify-between">
                      <span>{passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Strong' : 'Very Strong'}</span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-1 bg-primary rounded-full transition-all duration-300" 
                        style={{ width: `${passwordStrength * 20}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <ul className="space-y-1 text-sm mt-2">
                  <li className="flex items-center">
                    {validations.length ? 
                      <Check className="h-4 w-4 text-themison-success mr-2" /> : 
                      <X className="h-4 w-4 text-destructive mr-2" />
                    }
                    <span className={validations.length ? "text-themison-success" : "text-destructive"}>
                      Between 8 and 64 characters
                    </span>
                  </li>
                  <li className="flex items-center">
                    {validations.uppercase ? 
                      <Check className="h-4 w-4 text-themison-success mr-2" /> : 
                      <X className="h-4 w-4 text-destructive mr-2" />
                    }
                    <span className={validations.uppercase ? "text-themison-success" : "text-destructive"}>
                      At least one uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {validations.lowercase ? 
                      <Check className="h-4 w-4 text-themison-success mr-2" /> : 
                      <X className="h-4 w-4 text-destructive mr-2" />
                    }
                    <span className={validations.lowercase ? "text-themison-success" : "text-destructive"}>
                      At least one lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {validations.number ? 
                      <Check className="h-4 w-4 text-themison-success mr-2" /> : 
                      <X className="h-4 w-4 text-destructive mr-2" />
                    }
                    <span className={validations.number ? "text-themison-success" : "text-destructive"}>
                      At least one number
                    </span>
                  </li>
                  <li className="flex items-center">
                    {validations.special ? 
                      <Check className="h-4 w-4 text-themison-success mr-2" /> : 
                      <X className="h-4 w-4 text-destructive mr-2" />
                    }
                    <span className={validations.special ? "text-themison-success" : "text-destructive"}>
                      At least one special character
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
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
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium"
            disabled={passwordStrength < 4}
          >
            Continue
          </button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-primary hover:text-primary-hover text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { RegisterForm };

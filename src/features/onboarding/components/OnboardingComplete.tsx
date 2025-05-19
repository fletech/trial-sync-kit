
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingComplete = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-50 p-6">
            <Check className="h-12 w-12 text-themison-success" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-4">Onboarding complete</h1>
        <p className="text-themison-gray mb-8">Now you can start managing your studies</p>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="themison-button"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
};

export default OnboardingComplete;

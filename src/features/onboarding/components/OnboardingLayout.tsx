
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingLayout = ({ 
  children, 
  currentStep,
  totalSteps = 3
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 border-b">
        <div className="container max-w-7xl">
          <Link to="/" className="text-2xl font-bold text-primary">THEMISON</Link>
        </div>
      </header>
      
      <main className="container max-w-7xl py-12">
        <div className="flex flex-col space-y-12">
          <div className="flex flex-col max-w-2xl">
            <div className="mb-2">
              <p className="text-themison-gray">Step {currentStep} of {totalSteps}</p>
            </div>
            
            <div className="h-1 w-full bg-gray-200 rounded-full mb-6">
              <div 
                className="h-1 bg-primary rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

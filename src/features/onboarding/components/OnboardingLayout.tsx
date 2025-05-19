
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
      <header className="py-4 px-6 md:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold text-primary">THEMISON</Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-2xl">
          <div className="mb-4">
            <p className="text-themison-gray">Step {currentStep} of {totalSteps}</p>
          </div>
          
          <div className="h-1 w-full bg-gray-200 rounded-full mb-8">
            <div 
              className="h-1 bg-primary rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
};

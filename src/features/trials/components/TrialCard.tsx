
import { FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Trial {
  id: number;
  name: string;
  description: string;
  status: string;
  location: string;
  progress: string;
  upcoming: string;
  pendingTask: string;
}

interface TrialCardProps {
  trial: Trial;
}

// NOTE: This component is no longer used in the Dashboard but kept for reference
export const TrialCard = ({ trial }: TrialCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting':
        return 'bg-blue-100 text-blue-800';
      case 'randomization':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getProgressWidth = (progress: string) => {
    switch (progress) {
      case 'start':
        return '25%';
      case 'routine-visits':
        return '50%';
      case 'mid-trial':
        return '65%';
      default:
        return '10%';
    }
  };
  
  return (
    <Link to={`/trials/${trial.id}`} className="block">
      <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{trial.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(trial.status)}`}>
            {trial.status}
          </span>
        </div>
        
        <p className="text-themison-gray text-sm mb-4">{trial.description}</p>
        
        <div className="mb-4">
          <p className="text-xs text-themison-gray mb-1">Progress</p>
          <div className="h-1.5 w-full bg-gray-200 rounded-full">
            <div 
              className="h-1.5 bg-primary rounded-full" 
              style={{ width: getProgressWidth(trial.progress) }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 mb-4">
          <div>
            <p className="text-xs text-themison-gray mb-1">Location</p>
            <p className="text-sm font-medium">{trial.location}</p>
          </div>
          <div>
            <p className="text-xs text-themison-gray mb-1">Upcoming</p>
            <p className="text-sm font-medium">{trial.upcoming}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm">{trial.pendingTask}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

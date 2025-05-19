
import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { TrialCard } from './TrialCard';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data
  const trials = [
    {
      id: 1,
      name: 'OPERA Study',
      description: 'Optimizing Pancreatic Enzyme Replacement in Chronic Pancreatitis',
      status: 'recruiting',
      location: 'Milano',
      progress: 'start',
      upcoming: 'Ethics report',
      pendingTask: 'SAE report pending signature'
    },
    {
      id: 2,
      name: 'GERD-X Trial',
      description: 'Evaluating a Novel Endoscopic Procedure for Gastroesophageal Reflux Disease',
      status: 'randomization',
      location: 'Milano',
      progress: 'routine-visits',
      upcoming: 'Site monitoring visit',
      pendingTask: 'Protocol amendment for review'
    },
    {
      id: 3,
      name: 'CardioRegen',
      description: 'Cardiac Regeneration Using Stem Cell Therapy',
      status: 'active',
      location: 'New York',
      progress: 'mid-trial',
      upcoming: 'Data monitoring committee review',
      pendingTask: 'Completion of follow-up visits'
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link 
          to="/trials/new"
          className="flex items-center bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          New Trial
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-80 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trials.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>
    </DashboardLayout>
  );
};

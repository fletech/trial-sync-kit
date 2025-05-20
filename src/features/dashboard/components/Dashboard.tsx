import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Plus, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
interface Trial {
  id: number;
  name: string;
  description: string;
  status: string;
  location: string;
  progress: string;
  upcoming: string;
  pendingTask: string;
  phase: string;
}
const phases = ["All phases", "Study start-up", "Recruitment", "Pre-screening visit", "Screening visit", "Randomization visit", "Routine visit", "Termination visit"];
const locations = ["All places", "Castellanza", "Bergamo", "Torino", "Milano", "Catania"];
export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhase, setActivePhase] = useState('All phases');
  const [activeLocation, setActiveLocation] = useState('All places');

  // Sample data based on the reference image
  const trials: Trial[] = [{
    id: 1,
    name: 'OPERA Study',
    description: 'Optimizing Pancreatic Enzyme Replacement in Chronic Pancreatitis',
    status: 'recruiting',
    location: 'Milano',
    progress: 'start',
    upcoming: 'Ethics report',
    pendingTask: '1 SAE report pending signature',
    phase: 'Study start-up'
  }, {
    id: 2,
    name: 'GERD-X Trial',
    description: 'Evaluating a Novel Endoscopic Procedure for Gastroesophageal Reflux Disease',
    status: 'randomization',
    location: 'Milano',
    progress: 'routine-visits',
    upcoming: 'Site monitoring visit',
    pendingTask: 'Device amendment v2 pending ethics',
    phase: 'Randomization visit'
  }, {
    id: 3,
    name: 'LIVER-FIBROSIS',
    description: 'Non-invasive Assessment of Liver Fibrosis in Non-Alcoholic Fatty Liver Disease',
    status: 'active',
    location: 'Milano',
    progress: 'mid-trial',
    upcoming: 'Imaging quality review due May 5',
    pendingTask: 'Protocol update pending signature',
    phase: 'Routine visit'
  }, {
    id: 4,
    name: 'IBD Biomarker Study',
    description: 'Identifying Predictors of Treatment Response in Inflammatory Bowel Disease',
    status: 'active',
    location: 'Milano',
    progress: 'mid-trial',
    upcoming: 'Imaging quality review due May 5',
    pendingTask: 'Protocol update pending signature',
    phase: 'Routine visit'
  }];

  // Filter trials based on search, phase and location
  const filteredTrials = trials.filter(trial => {
    const matchesSearch = searchQuery === '' || trial.name.toLowerCase().includes(searchQuery.toLowerCase()) || trial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = activePhase === 'All phases' || trial.phase === activePhase;
    const matchesLocation = activeLocation === 'All places' || trial.location === activeLocation;
    return matchesSearch && matchesPhase && matchesLocation;
  });
  const breadcrumbItems = [{
    name: 'Home',
    href: '/'
  }, {
    name: 'Trials'
  }];
  const clearSearch = () => {
    setSearchQuery('');
  };
  return <DashboardLayout>
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Trials</h1>
          <p className="text-themison-gray">{filteredTrials.length} Active Studies</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/trials/new" className="flex items-center bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Create trial
          </Link>
        </div>
      </div>
      
      <div className="relative mb-6 max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" placeholder="Search Your Study Here" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        {searchQuery && <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>}
      </div>
      
      <div className="mb-6">
        <div className="mb-3">
          <p className="text-sm font-medium text-themison-gray mb-2">Phases</p>
          <div className="flex flex-wrap gap-2">
            {phases.map(phase => <button key={phase} className={`px-4 py-2 text-sm rounded-md transition-colors ${activePhase === phase ? 'bg-primary text-white' : 'bg-gray-200 text-themison-text hover:bg-gray-300'}`} onClick={() => setActivePhase(phase)}>
                {phase}
              </button>)}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-themison-gray mb-2">Locations</p>
          <div className="flex flex-wrap gap-2">
            {locations.map(location => <button key={location} className={`px-4 py-2 text-sm rounded-md transition-colors ${activeLocation === location ? 'bg-primary text-white' : 'bg-gray-200 text-themison-text hover:bg-gray-300'}`} onClick={() => setActiveLocation(location)}>
                {location}
              </button>)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrials.map(trial => <Link to={`/trials/${trial.id}`} key={trial.id} className="block bg-white rounded-lg overflow-hidden border shadow-sm transition-all hover:shadow-md">
            <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-50">
              <div className="absolute top-3 left-3">
                {trial.status === 'recruiting' && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Recruiting
                  </span>}
                {trial.status === 'randomization' && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Randomization
                  </span>}
                {trial.status === 'active' && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Visit {trial.id}
                  </span>}
              </div>
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-themison-text">
                  {trial.location}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">{trial.name}</h3>
              <p className="text-themison-gray text-sm mb-5 line-clamp-2">{trial.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-themison-gray mb-1">
                  <span>{trial.progress === 'start' ? 'Start' : 'Routine visits'}</span>
                  <span>Close-out</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-primary rounded-full" style={{
                width: trial.progress === 'start' ? '10%' : trial.progress === 'routine-visits' ? '50%' : trial.progress === 'mid-trial' ? '65%' : '20%'
              }} />
                </div>
              </div>
              
              <div className="mb-4 pt-3 border-t">
                <div className="flex items-center mb-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4.00001V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4.00001C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#6D7688" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 1.33334V4.00001" stroke="#6D7688" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.33325 1.33334V4.00001" stroke="#6D7688" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 6.66667H14" stroke="#6D7688" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm">Next: {trial.upcoming}</span>
                </div>
                
                <div className="flex items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M8.00008 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8.00008 1.33337C4.31818 1.33337 1.33341 4.31814 1.33341 8.00004C1.33341 11.6819 4.31818 14.6667 8.00008 14.6667Z" stroke="#FF9800" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.33337V8.00004" stroke="#FF9800" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 10.6667H8.00667" stroke="#FF9800" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm">{trial.pendingTask}</span>
                </div>
              </div>
            </div>
          </Link>)}
      </div>
    </DashboardLayout>;
};
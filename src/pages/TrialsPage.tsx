import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Plus, Search, Calendar, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Trial {
  id: number;
  name: string;
  description: string;
  status: string;
  location: string;
  progress: number; // porcentaje
  upcoming: string;
  pendingTask: string;
  phase: string;
  image?: string;
  isNew?: boolean;
}

const phases = [
  "All phases",
  "Study start-up",
  "Recruitment",
  "Pre-screening visit",
  "Screening visit",
  "Randomization visit",
  "Routine visit",
  "Termination visit",
  "Close-out",
];
const locations = [
  "All places",
  "Castellanza",
  "Bergamo",
  "Torino",
  "Milano",
  "Catania",
];

const trialImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
];

export const TrialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState(phases[0]);
  const [activeLocation, setActiveLocation] = useState(locations[0]);

  const trials: Trial[] = [
    {
      id: 1,
      name: "OPERA Study",
      description:
        "Optimizing Pancreatic Enzyme Replacement in Chronic Pancreatitis",
      status: "Recruiting",
      location: "Milano",
      progress: 10,
      upcoming: "Ethics report",
      pendingTask: "1 SAE report pending signature",
      phase: "Recruitment",
      image: "",
      isNew: true,
    },
    {
      id: 2,
      name: "GERD-X Trial",
      description:
        "Evaluating a Novel Endoscopic Procedure for Gastroesophageal Reflux Disease",
      status: "Randomization",
      location: "Milano",
      progress: 40,
      upcoming: "Upcoming procedure audit",
      pendingTask: "Device amendment v2 pending ethics",
      phase: "Randomization visit",
      image: "",
    },
    {
      id: 3,
      name: "LIVER-FIBROSIS",
      description:
        "Non-invasive Assessment of Liver Fibrosis in Non-Alcoholic Fatty Liver Disease",
      status: "Active",
      location: "Milano",
      progress: 70,
      upcoming: "Imaging quality review due May 5",
      pendingTask: "Protocol update pending signature",
      phase: "Routine visit",
      image: "",
    },
    {
      id: 4,
      name: "IBD Biomarker Study",
      description:
        "Identifying Predictors of Treatment Response in Inflammatory Bowel Disease",
      status: "Active",
      location: "Milano",
      progress: 100,
      upcoming: "Imaging quality review due May 5",
      pendingTask: "Protocol update pending signature",
      phase: "Close-out",
      image: "",
    },
  ];

  const filteredTrials = trials.filter((trial) => {
    const matchesSearch =
      searchQuery === "" ||
      trial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase =
      activePhase === "All phases" || trial.phase === activePhase;
    const matchesLocation =
      activeLocation === "All places" || trial.location === activeLocation;
    return matchesSearch && matchesPhase && matchesLocation;
  });

  // Helper para determinar la etapa actual
  function getStage(trial: Trial) {
    if (trial.isNew) return "Start";
    if (trial.phase === "Routine visit") return "Routine visits";
    if (trial.phase === "Close-out") return "Close-out";
    return "Routine visits";
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">Trials</h1>
          <p className="text-themison-gray text-base">
            {filteredTrials.length} Active Trials
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your trial here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            />
          </div>
          <Link
            to="/trials/new"
            className="flex items-center gap-2 bg-[#10121C] hover:bg-primary-hover text-white px-5 py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Plus className="h-5 w-5" /> Create trial
          </Link>
        </div>
      </div>

      {/* Filtros inline con labels al inicio */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap whitespace-nowrap">
          <span className="text-xs font-medium text-gray-500 mr-2">Phases</span>
          {phases.map((phase) => (
            <button
              key={phase}
              className={`text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                activePhase === phase
                  ? "bg-[#6C757D] text-white"
                  : "text-gray-700 bg-transparent"
              }`}
              style={
                activePhase !== phase
                  ? { background: "none", boxShadow: "none" }
                  : {}
              }
              onClick={() => setActivePhase(phase)}
            >
              {phase}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap whitespace-nowrap">
          <span className="text-xs font-medium text-gray-500 mr-2">
            Locations
          </span>
          {locations.map((location) => (
            <button
              key={location}
              className={`text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                activeLocation === location
                  ? "bg-[#6C757D] text-white"
                  : "text-gray-700 bg-transparent"
              }`}
              style={
                activeLocation !== location
                  ? { background: "none", boxShadow: "none" }
                  : {}
              }
              onClick={() => setActiveLocation(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-6">
        {filteredTrials.map((trial) => (
          <div
            key={trial.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-lg"
          >
            {/* Imagen y badges */}
            <div
              className="relative h-36 w-full"
              style={{ background: "#6C757D" }}
            >
              {trial.image ? (
                <img
                  src={trial.image}
                  alt={trial.name}
                  className="object-cover w-full h-full"
                  style={{ minHeight: 144, maxHeight: 144 }}
                />
              ) : (
                <div className="w-full h-full" />
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                {/* Phase badge */}
                <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-success-soft text-success">
                  {trial.phase}
                </span>
                {/* Location badge */}
                <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-surface text-secondary">
                  {trial.location}
                </span>
                {/* New trial badge */}
                {trial.isNew && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-surface text-secondary">
                    New trial
                  </span>
                )}
              </div>
            </div>
            {/* Contenido */}
            <div className="flex-1 flex flex-col p-5">
              <h2 className="text-base font-normal mb-1 truncate text-heading">
                {trial.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {trial.description}
              </p>
              {/* Barra de progreso y etapas */}
              <div className="w-full flex flex-col gap-1 mb-4">
                <div className="relative w-full h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full absolute top-0 left-0 bg-primary-dark"
                    style={{ width: `${trial.progress}%` }}
                  />
                  {/* Circulo de close-out */}
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-dark" />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>
                    {getStage(trial) === "Start"
                      ? "Start"
                      : getStage(trial) === "Routine visits"
                      ? "Routine visits"
                      : ""}
                  </span>
                  <span>Close-out</span>
                </div>
              </div>
              {/* Upcoming */}
              <div className="flex items-center gap-2 bg-[#6C757D] bg-opacity-10 text-[#6C757D] text-xs rounded-md px-3 py-2 mb-2">
                <Calendar className="h-4 w-4 text-[#6C757D]" />
                <span className="font-medium">Next:</span> {trial.upcoming}
              </div>
              {/* Pending task */}
              <div className="flex items-center gap-2 bg-[#6C757D] bg-opacity-10 text-[#6C757D] text-xs rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 text-[#6C757D]" />
                {trial.pendingTask}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TrialsPage;

import { Calendar, AlertCircle } from "lucide-react";

interface Trial {
  id: string;
  name: string;
  description: string;
  status: string;
  location: string;
  progress: number;
  upcoming: string;
  pendingTask: string;
  phase: string;
  image?: string;
  isNew?: boolean;
  sponsor?: string;
  piContact?: string;
  studyStart?: string;
  estimatedCloseOut?: string;
}

interface TrialCardProps {
  trial: Trial;
  onClick?: (trial: Trial) => void;
  getStage: (trial: Trial) => string;
}

export const TrialCard = ({ trial, onClick, getStage }: TrialCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(trial);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-lg cursor-pointer w-full max-w-xl"
      onClick={handleClick}
    >
      {/* Imagen y badges */}
      <div className="relative h-36 w-full" style={{ background: "#6C757D" }}>
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
        <h2 className="text-base font-black mb-1 truncate text-heading">
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
            <span>{getStage(trial)}</span>
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
  );
};

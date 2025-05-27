import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface TrialContextType {
  selectedTrial: Trial | null;
  setSelectedTrial: (trial: Trial | null) => void;
  isTrialView: boolean;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export const useTrialContext = () => {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error("useTrialContext must be used within a TrialProvider");
  }
  return context;
};

interface TrialProviderProps {
  children: ReactNode;
}

export const TrialProvider = ({ children }: TrialProviderProps) => {
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);

  const value = {
    selectedTrial,
    setSelectedTrial,
    isTrialView: selectedTrial !== null,
  };

  return (
    <TrialContext.Provider value={value}>{children}</TrialContext.Provider>
  );
};


import React, { useState } from "react";
import { Search, Grid3X3, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PathOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface PathSelectionCardsProps {
  onPathSelect: (path: string) => void;
}

export const PathSelectionCards: React.FC<PathSelectionCardsProps> = ({
  onPathSelect,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>("/document-assistant");

  const pathOptions: PathOption[] = [
    {
      id: "document-assistant",
      title: "Document Assistant",
      icon: <Search className="w-8 h-8 text-gray-700" />,
      path: "/document-assistant",
    },
    {
      id: "task-manager",
      title: "Task Management",
      icon: <Grid3X3 className="w-8 h-8 text-gray-700" />,
      path: "/task-manager",
    },
    {
      id: "overview",
      title: "Trial Overview",
      icon: <BarChart3 className="w-8 h-8 text-gray-700" />,
      path: "",
    },
  ];

  const handlePathClick = (path: string) => {
    setSelectedPath(path);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="text-left">
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          Select The Feature You Want To Explore First
        </h3>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {pathOptions.map((option) => (
          <div
            key={option.id}
            className={`rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors min-w-[140px] h-[120px] ${
              selectedPath === option.path ? "bg-gray-100" : ""
            }`}
            onClick={() => handlePathClick(option.path)}
          >
            <div className="mb-3">
              {option.icon}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center">
              {option.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


import React from "react";
import { FileText, CheckSquare, BarChart3 } from "lucide-react";

interface PathOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface PathSelectionCardsProps {
  onPathSelect: (path: string) => void;
}

export const PathSelectionCards: React.FC<PathSelectionCardsProps> = ({
  onPathSelect,
}) => {
  const pathOptions: PathOption[] = [
    {
      id: "document-assistant",
      title: "Document Assistant",
      description: "Analyze and query your uploaded protocol",
      icon: <FileText className="w-12 h-12 text-blue-600 mb-4" />,
      path: "/document-assistant",
    },
    {
      id: "task-manager",
      title: "Task Management",
      description: "Manage tasks and timelines for your trial",
      icon: <CheckSquare className="w-12 h-12 text-green-600 mb-4" />,
      path: "/task-manager",
    },
    {
      id: "overview",
      title: "Trial Overview",
      description: "View comprehensive trial information",
      icon: <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />,
      path: "",
    },
  ];

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Great! Your protocol has been uploaded
        </h3>
        <p className="text-gray-600 text-sm">
          Select The Feature You Want To Explore First
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {pathOptions.map((option) => (
          <div
            key={option.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onPathSelect(option.path)}
          >
            <div className="flex justify-center">{option.icon}</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {option.title}
            </h4>
            <p className="text-gray-600 text-xs">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

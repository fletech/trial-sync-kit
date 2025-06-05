
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
      icon: <FileText className="w-10 h-10 text-blue-600" />,
      path: "/document-assistant",
    },
    {
      id: "task-manager",
      title: "Task Management",
      description: "Manage tasks and timelines for your trial",
      icon: <CheckSquare className="w-10 h-10 text-green-600" />,
      path: "/task-manager",
    },
    {
      id: "overview",
      title: "Trial Overview",
      description: "View comprehensive trial information",
      icon: <BarChart3 className="w-10 h-10 text-purple-600" />,
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

      <div className="space-y-4">
        {pathOptions.map((option) => (
          <div
            key={option.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPathSelect(option.path)}
          >
            <div className="flex-shrink-0 mr-4">
              {option.icon}
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900">
                {option.title}
              </h4>
              <p className="text-gray-600 text-sm">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

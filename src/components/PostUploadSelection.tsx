
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, BarChart3 } from "lucide-react";

interface PostUploadSelectionProps {
  trial: any;
  onPathSelect: (path: string) => void;
}

export const PostUploadSelection: React.FC<PostUploadSelectionProps> = ({
  trial,
  onPathSelect,
}) => {
  const pathOptions = [
    {
      id: "document-assistant",
      title: "Document Assistant",
      description: "Analyze and query your uploaded protocol",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      path: "/document-assistant",
    },
    {
      id: "task-manager",
      title: "Task Management",
      description: "Manage tasks and timelines for your trial",
      icon: <CheckSquare className="w-8 h-8 text-green-600" />,
      path: "/task-manager",
    },
    {
      id: "overview",
      title: "Trial Overview",
      description: "View comprehensive trial information",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      path: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Great! Your protocol has been uploaded
          </h1>
          <p className="text-gray-600">
            What would you like to do next with {trial.name}?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onPathSelect(option.path)}
            >
              <div className="flex justify-center mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 mb-6">{option.description}</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onPathSelect(option.path);
                }}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

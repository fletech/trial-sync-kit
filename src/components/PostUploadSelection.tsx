
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Great! Your protocol has been uploaded
          </h1>
          <p className="text-gray-600">
            Select The Feature You Want To Explore First
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pathOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onPathSelect(option.path)}
            >
              <div className="flex justify-center">{option.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => onPathSelect("/document-assistant")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};


import { DashboardLayout } from "@/layouts/DashboardLayout";
import { FlaskConical, CheckSquare, Users, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storage from "@/services/storage";
import { DocumentUpload } from "@/components/DocumentUpload";

const quickLinks = [
  {
    title: "Trials",
    description: "View and manage your clinical trials.",
    href: "/trials",
    icon: <FlaskConical className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Tasks",
    description: "Check your pending tasks and deadlines.",
    href: "/task-manager",
    icon: <CheckSquare className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Organization",
    description: "Manage your team and organization info.",
    href: "/organization",
    icon: <Users className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Profile",
    description: "Update your personal information.",
    href: "/profile",
    icon: <User className="h-8 w-8 text-primary mb-2" />,
  },
];

export const DashboardPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs to upload documents
    const trials = storage.getTrials();
    if (trials.length > 0) {
      const latestTrial = trials[trials.length - 1];
      const trialDocuments = storage.getTrialDocuments(latestTrial.id);
      
      // If latest trial has no documents, show upload UI
      if (trialDocuments.length === 0) {
        setCurrentTrial(latestTrial);
        setShowUpload(true);
      }
    }
  }, []);

  const handleUploadComplete = (document) => {
    if (currentTrial) {
      // Save document with reference as "protocol.pdf"
      const savedDoc = storage.saveTrialDocument(currentTrial.id, {
        ...document,
        displayName: document.name,
        name: "protocol.pdf", // Always reference as protocol.pdf for AI
      });
      
      // Navigate directly to the selected path
      const selectedPath = document.selectedPath || "/document-assistant";
      navigate(`/trials/${currentTrial.id}${selectedPath}`);
    }
  };

  // Show upload UI if user needs to upload documents
  if (showUpload && currentTrial) {
    return (
      <DashboardLayout>
        <DocumentUpload
          onUploadComplete={handleUploadComplete}
          trialName={currentTrial.name}
          standalone={true}
        />
      </DashboardLayout>
    );
  }

  // Show regular dashboard
  return (
    <DashboardLayout>
      <div className="mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">
            Welcome to Themison
          </h1>
          <p className="text-themison-gray text-lg mb-6">
            Quick access to your most important actions.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-7 shadow-sm hover:shadow-lg transition-shadow group hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {link.icon}
            <h2 className="text-lg font-semibold mb-1 text-gray-900 group-hover:text-primary transition-colors">
              {link.title}
            </h2>
            <p className="text-themison-gray text-sm text-center">
              {link.description}
            </p>
          </a>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

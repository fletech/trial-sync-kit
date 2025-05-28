import React, { useState, useEffect } from "react";
import { useTrialContext } from "@/contexts/TrialContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TaskProvider } from "@/features/taskManagement/context/TaskContext";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentAssistantInterface } from "@/components/DocumentAssistantInterface";
import storage from "@/services/storage";

// Trial section components (we'll create these)
const TrialOverview = ({ trial }: { trial: any }) => {
  const getStatusName = (statusId: string): string => {
    // This should match the logic from TrialsPage
    return statusId.charAt(0).toUpperCase() + statusId.slice(1);
  };

  const getStatusColor = (statusId: string): string => {
    // This should match the logic from TrialsPage
    switch (statusId) {
      case "recruiting":
        return "#10b981";
      case "active":
        return "#3b82f6";
      case "completed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1 text-gray-900">
          {trial.name}
        </h1>
        <p className="text-themison-gray text-base">Trial Overview & Details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            Study Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Study name
              </label>
              <div className="text-base font-medium text-gray-900">
                {trial.name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Study description
              </label>
              <div className="text-sm text-gray-700 leading-relaxed">
                {trial.description}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Sponsor
              </label>
              <div className="text-sm font-medium text-gray-900">
                {trial.sponsor || "LumenPath Biosciences"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                PI and study coordinator contacts
              </label>
              <div className="text-sm font-medium text-gray-900">
                {trial.piContact || "Prof. Cesare Hassan"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Locations & phases
              </label>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  {trial.location}
                </span>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {trial.phase}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline & Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            Timeline & Progress
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Study start
              </label>
              <div className="text-sm font-medium text-gray-900">
                {trial.studyStart || "01 September 2025"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Estimated close-out date
              </label>
              <div className="text-sm font-medium text-gray-900">
                {trial.estimatedCloseOut || "13 December 2025"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-3">
                Progress
              </label>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${trial.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start</span>
                  <span className="font-medium text-gray-700">
                    {trial.progress}%
                  </span>
                  <span>Close-out</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Status
              </label>
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{
                  backgroundColor: getStatusColor(trial.status),
                }}
              >
                {getStatusName(trial.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Tasks & Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            Current Tasks
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Next upcoming task
              </label>
              <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                {trial.upcoming}
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Pending task
              </label>
              <div className="text-sm text-gray-900 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
                {trial.pendingTask}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            Additional Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Protocol Version
              </label>
              <div className="text-sm font-medium text-gray-900">
                Version 2.1
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                IRB Approval Status
              </label>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Approved
              </span>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Target Enrollment
              </label>
              <div className="text-sm font-medium text-gray-900">
                150 participants
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Current Enrollment
              </label>
              <div className="text-sm font-medium text-gray-900">
                <span className="text-lg font-semibold text-blue-600">
                  {Math.floor((trial.progress / 100) * 150)}
                </span>
                <span className="text-gray-500"> / 150 participants</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {trial.progress}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Study Type
              </label>
              <div className="text-sm font-medium text-gray-900">
                Interventional
              </div>
            </div>

            <div>
              <label className="block text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Primary Endpoint
              </label>
              <div className="text-sm text-gray-700 leading-relaxed">
                Change in symptom severity score from baseline to week 12
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrialTaskManagement = () => {
  return (
    <TaskProvider>
      <div>
        <h1 className="text-3xl font-semibold mb-1 text-gray-900">
          Task Management
        </h1>
        <p className="text-themison-gray text-base mb-6">
          Manage trial tasks and workflows
        </p>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            Task Management interface will be implemented here.
            <br />
            <span className="text-sm">
              Navigate to the dedicated task manager using the sidebar to see
              filtered tasks for this trial.
            </span>
          </p>
        </div>
      </div>
    </TaskProvider>
  );
};

const TrialDocumentAssistant = () => {
  const { selectedTrial } = useTrialContext();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (selectedTrial) {
      const trialDocuments = storage.getTrialDocuments(selectedTrial.id);
      setDocuments(trialDocuments);
      setIsLoading(false);
    }
  }, [selectedTrial]);

  const handleUploadComplete = (document: any) => {
    if (selectedTrial) {
      const savedDocument = storage.saveTrialDocument(
        selectedTrial.id,
        document
      );
      setDocuments([...documents, savedDocument]);
      setShowUpload(false); // Hide upload interface after successful upload
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    storage.deleteTrialDocument(documentId);
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  const handleUploadDocument = () => {
    setShowUpload(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If showing upload interface
  if (showUpload || documents.length === 0) {
    return (
      <DocumentUpload
        onUploadComplete={handleUploadComplete}
        trialName={selectedTrial?.name || "Study"}
      />
    );
  }

  // If documents exist, show the assistant interface with all documents
  return (
    <DocumentAssistantInterface
      documents={documents}
      trialName={selectedTrial?.name || "Study"}
      onRemoveDocument={handleRemoveDocument}
      onUploadDocument={handleUploadDocument}
    />
  );
};

const TrialTeamRoles = () => (
  <div>
    <h1 className="text-3xl font-semibold mb-1 text-gray-900">Team & Roles</h1>
    <p className="text-themison-gray text-base mb-6">
      Manage team members and their roles
    </p>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-500">
        Team & Roles interface will be implemented here
      </p>
    </div>
  </div>
);

const TrialNotifications = () => (
  <div>
    <h1 className="text-3xl font-semibold mb-1 text-gray-900">Notifications</h1>
    <p className="text-themison-gray text-base mb-6">
      Trial-specific notifications and alerts
    </p>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-500">
        Trial Notifications interface will be implemented here
      </p>
    </div>
  </div>
);

const TrialIntegrations = () => (
  <div>
    <h1 className="text-3xl font-semibold mb-1 text-gray-900">Integrations</h1>
    <p className="text-themison-gray text-base mb-6">
      Trial-specific integrations and connections
    </p>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p className="text-gray-500">
        Trial Integrations interface will be implemented here
      </p>
    </div>
  </div>
);

interface TrialViewProps {
  currentSection: string;
}

export const TrialView = ({
  currentSection: initialSection,
}: TrialViewProps) => {
  const { selectedTrial } = useTrialContext();
  const [currentSection, setCurrentSection] = useState(
    initialSection || "overview"
  );

  useEffect(() => {
    // Listen for section changes from the sidebar
    const handleSectionChange = (event: CustomEvent) => {
      setCurrentSection(event.detail.section);
    };

    window.addEventListener(
      "trialSectionChanged",
      handleSectionChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "trialSectionChanged",
        handleSectionChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    setCurrentSection(initialSection || "overview");
  }, [initialSection]);

  if (!selectedTrial) {
    return null;
  }

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return <TrialOverview trial={selectedTrial} />;
      case "task-management":
        return <TrialTaskManagement />;
      case "document-assistant":
        return <TrialDocumentAssistant />;
      case "team-roles":
        return <TrialTeamRoles />;
      case "notifications":
        return <TrialNotifications />;
      case "integrations":
        return <TrialIntegrations />;
      default:
        return <TrialOverview trial={selectedTrial} />;
    }
  };

  return (
    <div>
      <Breadcrumb />
      {renderSection()}
    </div>
  );
};

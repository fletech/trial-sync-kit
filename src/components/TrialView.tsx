import { useTrialContext } from "@/contexts/TrialContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TrialOverview = ({
  trial,
  principalInvestigator,
}: {
  trial: any;
  principalInvestigator: string;
}) => {
  const getStatusName = (statusId: string | null | undefined): string => {
    if (!statusId) return "Unknown";
    return statusId.charAt(0).toUpperCase() + statusId.slice(1);
  };

  const getStatusColor = (statusId: string | null | undefined): string => {
    if (!statusId) return "#6b7280";

    switch (statusId.toLowerCase()) {
      case "recruiting":
        return "#10b981";
      case "active":
        return "#3b82f6";
      case "completed":
        return "#6b7280";
      case "planning":
        return "#f59e0b";
      case "study":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  // Helper function to safely get trial properties
  const getTrialProperty = (
    property: string,
    fallback: string | number = "Not specified"
  ) => {
    return trial?.[property] || fallback;
  };

  return (
    <div className="space-y-6">
      {/* Trial Info Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {getTrialProperty("name", "Unnamed Trial")}
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          {getTrialProperty("description", "No description available")}
        </p>
        <div className="flex items-center gap-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: getStatusColor(trial?.status) }}
          >
            {getStatusName(trial?.status)}
          </span>
          <span className="text-gray-500">
            {getTrialProperty("phase", "Phase not specified")}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">
            {getTrialProperty("location", "Location not specified")}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold">
                {getTrialProperty("progress", 0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getTrialProperty("progress", 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Study Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Study Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sponsor</span>
              <span className="font-medium">
                {getTrialProperty("sponsor", "Not specified")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PI Contact</span>
              <span className="font-medium">
                {principalInvestigator || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Study Start</span>
              <span className="font-medium">
                {getTrialProperty("study_start", "Not specified")}
              </span>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Current Tasks
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Upcoming</p>
              <p className="text-sm text-yellow-700">
                {getTrialProperty("upcoming", "No upcoming tasks")}
              </p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Pending</p>
              <p className="text-sm text-red-700">
                {getTrialProperty("pending_task", "No pending tasks")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trial Header Component - Small indicator showing which trial we're working on
const TrialHeader = ({ trial }: { trial: any }) => {
  const getStatusColor = (statusId: string | null | undefined): string => {
    if (!statusId) return "#6b7280";

    switch (statusId.toLowerCase()) {
      case "recruiting":
        return "#10b981";
      case "active":
        return "#3b82f6";
      case "completed":
        return "#6b7280";
      case "planning":
        return "#f59e0b";
      case "study":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getStatusName = (statusId: string | null | undefined): string => {
    if (!statusId) return "Unknown";
    return statusId.charAt(0).toUpperCase() + statusId.slice(1);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-blue-700 text-sm font-semibold">
            {trial?.name || "Unnamed Trial"}
          </span>
          <span className="text-blue-500">•</span>
          <span className="text-blue-600 text-sm">
            {trial?.phase || "Phase not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getStatusColor(trial?.status) }}
          ></span>
          <span className="text-blue-700 text-sm">
            {getStatusName(trial?.status)}
          </span>
        </div>
      </div>
    </div>
  );
};

const TrialTabs = () => {
  const { trialId } = useParams<{ trialId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/tasks")) return "tasks";
    if (path.includes("/document-assistant")) return "document-assistant";
    if (path.includes("/team")) return "team";
    return "overview";
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: "overview", label: "Overview", path: `/trials/${trialId}` },
    { id: "tasks", label: "Tasks", path: `/trials/${trialId}/tasks` },
    {
      id: "document-assistant",
      label: "Document Assistant",
      path: `/trials/${trialId}/document-assistant`,
    },
    { id: "team", label: "Team & Roles", path: `/trials/${trialId}/team` },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.path)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const PlaceholderContent = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-3xl font-semibold mb-1 text-gray-900">{title}</h1>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mt-6">
      <p className="text-gray-500 text-lg">
        Content not designed yet. Features to be decided.
      </p>
    </div>
  </div>
);

export const TrialView = () => {
  const { selectedTrial } = useTrialContext();
  const location = useLocation();
  const [principalInvestigator, setPrincipalInvestigator] =
    useState<string>("");

  // Function to get Principal Investigator from team_members
  const getPrincipalInvestigator = async (trialId: string) => {
    try {
      // First, get the trial to find its team_id
      const { data: trial, error: trialError } = await supabase
        .from("trials")
        .select("team_id")
        .eq("id", trialId)
        .single();

      if (trialError || !trial?.team_id) {
        console.error("Error getting trial team_id:", trialError);
        return "Not specified";
      }

      // Then, get team members with role "Principal investigator"
      const { data: teamMembers, error: teamError } = await supabase
        .from("team_members")
        .select("name")
        .eq("team_id", trial.team_id)
        .ilike("role", "%principal investigator%");

      if (teamError) {
        console.error("Error getting team members:", teamError);
        return "Not specified";
      }

      if (teamMembers && teamMembers.length > 0) {
        return teamMembers[0].name;
      }

      return "Not specified";
    } catch (error) {
      console.error("Error in getPrincipalInvestigator:", error);
      return "Not specified";
    }
  };

  // Load Principal Investigator when trial changes
  useEffect(() => {
    if (selectedTrial?.id) {
      getPrincipalInvestigator(selectedTrial.id).then(setPrincipalInvestigator);
    }
  }, [selectedTrial?.id]);

  // Determine current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes("/tasks")) return "tasks";
    if (path.includes("/document-assistant")) return "document-assistant";
    if (path.includes("/team")) return "team";
    return "overview";
  };

  const currentSection = getCurrentSection();

  if (!selectedTrial) {
    return null;
  }

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return (
          <TrialOverview
            trial={selectedTrial}
            principalInvestigator={principalInvestigator}
          />
        );
      case "tasks":
        return <PlaceholderContent title="Task Management" />;
      case "document-assistant":
        return <PlaceholderContent title="Document Assistant" />;
      case "team":
        return <PlaceholderContent title="Team & Roles" />;
      default:
        return (
          <TrialOverview
            trial={selectedTrial}
            principalInvestigator={principalInvestigator}
          />
        );
    }
  };

  return (
    <div>
      <Breadcrumb />
      <TrialHeader trial={selectedTrial} />
      <TrialTabs />
      {renderSection()}
    </div>
  );
};

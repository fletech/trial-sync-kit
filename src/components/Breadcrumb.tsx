import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useTrialContext } from "@/contexts/TrialContext";
import { useLocation } from "react-router-dom";

export const Breadcrumb = () => {
  const { selectedTrial, isTrialView } = useTrialContext();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState("Overview");

  useEffect(() => {
    // Listen for section changes from the sidebar
    const handleSectionChange = (event: CustomEvent) => {
      const sectionMap: { [key: string]: string } = {
        overview: "Overview",
        "task-management": "Task Management",
        "document-assistant": "Document Assistant",
        "team-roles": "Team & Roles",
        notifications: "Notifications",
        integrations: "Integrations",
      };
      setCurrentSection(sectionMap[event.detail.section] || "Overview");
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

  if (!isTrialView || !selectedTrial) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <span className="hover:text-gray-700 cursor-pointer">Home</span>
      <ChevronRight className="h-4 w-4" />
      <span className="hover:text-gray-700 cursor-pointer">Trials</span>
      <ChevronRight className="h-4 w-4" />
      <span className="hover:text-gray-700 cursor-pointer">
        {selectedTrial.name}
      </span>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 font-medium">{currentSection}</span>
    </nav>
  );
};

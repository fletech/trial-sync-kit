import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TrialView } from "@/components/TrialView";
import { useTrialContext } from "@/contexts/TrialContext";
import storage from "@/services/storage";
import { toast } from "sonner";

const TrialDetailPage = () => {
  const { trialId } = useParams<{ trialId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTrial, setSelectedTrial } = useTrialContext();
  const [currentSection, setCurrentSection] = useState("overview");

  useEffect(() => {
    // Determine the current section based on the URL path
    const path = location.pathname;
    if (path.includes("/document-assistant")) {
      setCurrentSection("document-assistant");
    } else if (path.includes("/task-manager")) {
      setCurrentSection("task-management");
    } else if (path.includes("/team-roles")) {
      setCurrentSection("team-roles");
    } else if (path.includes("/notifications")) {
      setCurrentSection("notifications");
    } else if (path.includes("/integrations")) {
      setCurrentSection("integrations");
    } else {
      setCurrentSection("overview");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (trialId) {
      // Load the trial from storage if not already selected or if different trial
      if (!selectedTrial || selectedTrial.id !== trialId) {
        const trials = storage.getTrials();
        const trial = trials.find((t) => t.id === trialId);

        if (trial) {
          setSelectedTrial(trial);
        } else {
          toast.error("Trial not found");
          navigate("/trials");
        }
      }
    }
  }, [trialId, selectedTrial, setSelectedTrial, navigate]);

  // Listen for section changes from the sidebar and update URL accordingly
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      const section = event.detail.section;
      setCurrentSection(section);

      // Update URL based on section
      if (section === "overview") {
        navigate(`/trials/${trialId}`, { replace: true });
      } else if (section === "task-management") {
        navigate(`/trials/${trialId}/task-manager`, { replace: true });
      } else if (section === "document-assistant") {
        navigate(`/trials/${trialId}/document-assistant`, { replace: true });
      } else {
        // For other sections, stay on the main trial page but update the view
        navigate(`/trials/${trialId}`, { replace: true });
      }
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
  }, [trialId, navigate]);

  if (!selectedTrial) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Loading trial...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TrialView currentSection={currentSection} />
    </DashboardLayout>
  );
};

export default TrialDetailPage;

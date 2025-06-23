import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TrialView } from "@/components/TrialView";
import { useTrialContext } from "@/contexts/TrialContext";
import storage from "@/services/storage";
import { toast } from "sonner";

const TrialDetailPage = () => {
  const { trialId } = useParams<{ trialId: string }>();
  const navigate = useNavigate();
  const { selectedTrial, setSelectedTrial } = useTrialContext();

  useEffect(() => {
    const loadTrial = async () => {
      if (trialId) {
        // Load the trial from storage if not already selected or if different trial
        if (!selectedTrial || selectedTrial.id !== trialId) {
          try {
            const trials = await storage.getTrials();
            const trial = trials.find((t) => t.id === trialId);

            if (trial) {
              setSelectedTrial(trial);
            } else {
              toast.error("Trial not found");
              navigate("/trials");
            }
          } catch (error) {
            console.error("Error loading trial:", error);
            toast.error("Failed to load trial");
            navigate("/trials");
          }
        }
      }
    };

    loadTrial();
  }, [trialId, selectedTrial, setSelectedTrial, navigate]);

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
      <TrialView />
    </DashboardLayout>
  );
};

export default TrialDetailPage;

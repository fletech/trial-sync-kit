import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { updateOnboardingStep } from "@/services/userService";
import { RoleSelector } from "@/components/RoleSelector";

export const StepOnePage = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved role if available
  useEffect(() => {
    const savedStatus = localStorage.getItem("themison_onboarding");
    if (savedStatus) {
      const { role: savedRole } = JSON.parse(savedStatus);
      if (savedRole) {
        setRole(savedRole);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast({
        title: "Role selection required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage using our service
    updateOnboardingStep(1, role);

    // Navigate to next step
    navigate("/onboarding/step2");
  };

  return (
    <OnboardingLayout currentStep={1}>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Who are you?</h2>

        <div>
          <h3 className="text-xl font-medium mb-2">Tell us who you are</h3>
          <p className="text-themison-gray mb-6">
            Get tools and content tailored to your role for faster setup.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <RoleSelector
              value={role}
              onChange={setRole}
              placeholder="Select your role"
            />

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  );
};

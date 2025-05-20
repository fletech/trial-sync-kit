import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";
import { updateOnboardingStep } from "@/services/userService";

const roles = [
  "Principal investigator",
  "Clinical research coordinator",
  "Physician/doctor/PhD student",
];

export const StepOnePage = () => {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
            <div className="relative">
              <div
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span
                  className={role ? "text-themison-text" : "text-themison-gray"}
                >
                  {role || "Select your role"}
                </span>
                <ChevronDown className="h-5 w-5 text-themison-gray" />
              </div>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  <ul className="py-1">
                    {roles.map((r) => (
                      <li
                        key={r}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRole(r);
                          setIsOpen(false);
                        }}
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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

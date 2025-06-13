import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { updateOnboardingStep } from "@/services/userService";
import { RoleSelector } from "@/components/RoleSelector";

export const StepOnePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved data if available
  useEffect(() => {
    const savedStatus = localStorage.getItem("themison_onboarding");
    if (savedStatus) {
      const { role: savedRole, userInfo } = JSON.parse(savedStatus);
      if (savedRole) {
        setRole(savedRole);
      }
      if (userInfo) {
        setFirstName(userInfo.firstName || "");
        setLastName(userInfo.lastName || "");
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return;
    }

    if (!role) {
      toast({
        title: "Role selection required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    // Save user info and role to localStorage using our service
    const userData = {
      role,
      userInfo: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    };

    updateOnboardingStep(1, userData);

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Role in Clinical Research *
              </label>
              <RoleSelector
                value={role}
                onChange={setRole}
                placeholder="Select your role"
              />
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

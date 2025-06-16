import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import {
  updateOnboardingStep,
  isUserInvited,
  completeInvitedUserOnboarding,
  getUserFromDB,
  getInvitedUserRole,
} from "@/services/userService";
import { RoleSelector } from "@/components/RoleSelector";

export const StepOnePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isInvitedUser, setIsInvitedUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Detect if this is for an invited user
  const isInvitedOnboarding = location.pathname === "/onboarding/invited";

  // Load data based on context (invited vs normal onboarding)
  useEffect(() => {
    const loadData = async () => {
      if (isInvitedOnboarding) {
        // For invited users, load from database and check invitation status
        const { user, profile } = await getUserFromDB();
        const invited = await isUserInvited();
        const invitedRole = invited ? await getInvitedUserRole() : null;

        setIsInvitedUser(invited);
        setUserEmail(user?.email || "");

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
        }

        if (invitedRole) {
          setRole(invitedRole);
        }
      } else {
        // For normal onboarding, load from localStorage
        const savedStatus = localStorage.getItem("themison_onboarding");
        if (savedStatus) {
          const {
            role: savedRole,
            userInfo,
            organizationName: savedOrgName,
          } = JSON.parse(savedStatus);
          if (savedRole) {
            setRole(savedRole);
          }
          if (userInfo) {
            setFirstName(userInfo.firstName || "");
            setLastName(userInfo.lastName || "");
          }
          if (savedOrgName) {
            setOrganizationName(savedOrgName);
          }
        }
      }
    };

    loadData();
  }, [isInvitedOnboarding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return;
    }

    if (!isInvitedOnboarding && !role) {
      toast({
        title: "Role selection required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    // For Principal Investigator, organization name is required
    if (
      !isInvitedOnboarding &&
      role === "Principal investigator" &&
      !organizationName.trim()
    ) {
      toast({
        title: "Organization name required",
        description: "Please enter your organization name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isInvitedOnboarding) {
        // Handle invited user completion
        const result = await completeInvitedUserOnboarding(
          firstName.trim(),
          lastName.trim()
        );

        if (result.success) {
          toast({
            title: "Welcome to the team!",
            description: "Your profile has been completed successfully.",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error",
            description:
              result.error || "Failed to complete profile. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Handle normal onboarding
        const userData = {
          role,
          userInfo: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
          ...(role === "Principal investigator" && {
            organizationName: organizationName.trim(),
          }),
        };

        updateOnboardingStep(1, userData);
        navigate("/onboarding/step2");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Compositional content based on context
  const content = isInvitedOnboarding
    ? {
        title: "Welcome to the team!",
        subtitle: "",
        description:
          "You've been invited to join a clinical trial team. Please complete your profile to get started.",
        showInfoBox: true,
        showRoleSelector: false,
        buttonText: isLoading ? "Completing..." : "Complete Profile",
        currentStep: 1,
        totalSteps: 1,
        previousStep: undefined,
      }
    : {
        title: "Who are you?",
        subtitle: "Tell us who you are",
        description:
          "Get tools and content tailored to your role for faster setup.",
        showInfoBox: false,
        showRoleSelector: true,
        buttonText: "Continue",
        currentStep: 1,
        totalSteps: 3,
        previousStep: undefined,
      };

  return (
    <OnboardingLayout
      currentStep={content.currentStep}
      totalSteps={content.totalSteps}
      previousStep={content.previousStep}
    >
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">{content.title}</h2>

        <div>
          {content.subtitle && (
            <h3 className="text-xl font-medium mb-2">{content.subtitle}</h3>
          )}
          <p className="text-themison-gray mb-6">{content.description}</p>

          {content.showInfoBox && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {userEmail}
              </p>
              <p className="text-sm text-blue-800 mt-1">
                You're joining as an invited team member. Just add your name to
                complete the setup.
              </p>
            </div>
          )}

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

            {content.showRoleSelector && (
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
            )}

            {content.showRoleSelector && role === "Principal investigator" && (
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Organization Name *
                </label>
                <input
                  id="organization"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter your organization name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be the name of your research
                  organization/institution.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium disabled:opacity-50"
            >
              {content.buttonText}
            </button>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  );
};

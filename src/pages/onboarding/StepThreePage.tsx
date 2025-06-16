import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import {
  getOnboardingStatus,
  saveCompleteOnboarding,
} from "@/services/userService";
import { RoleSelector, CLINICAL_ROLES } from "@/components/RoleSelector";

interface TeamMember {
  email: string;
  role: string;
}

export const StepThreePage = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { email: "", role: CLINICAL_ROLES[1] }, // Clinical research coordinator
  ]);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get onboarding status
  const onboardingStatus = getOnboardingStatus();

  // Load saved team members if available
  useEffect(() => {
    if (onboardingStatus?.team && onboardingStatus.team.length > 0) {
      setMembers(onboardingStatus.team);
    }
  }, []);

  const addMember = () => {
    setMembers([
      ...members,
      { email: "", role: CLINICAL_ROLES[1] }, // Clinical research coordinator
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (
    index: number,
    field: "email" | "role",
    value: string
  ) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validMembers = members.filter((m) => m.email.trim() !== "");
    const onboardingData = getOnboardingStatus();

    if (!onboardingData) {
      toast({
        title: "Error",
        description: "Onboarding data not found. Please start from step 1.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await saveCompleteOnboarding({
        profile: {
          first_name: onboardingData.userInfo?.firstName || "",
          last_name: onboardingData.userInfo?.lastName || "",
        },
        trial: {
          name: onboardingData.studyInfo?.name || "",
          location: onboardingData.studyInfo?.location || "",
          sponsor: onboardingData.studyInfo?.sponsor || "",
          phase: onboardingData.studyInfo?.phase || "",
        },
        teamMembers: validMembers.map((member) => ({
          name: member.email.split("@")[0], // Use email prefix as name
          email: member.email,
          role: member.role,
        })),
        currentUserRole: onboardingData.role || "",
      });

      if (result.success) {
        // Clear onboarding data from localStorage
        localStorage.removeItem("themison_onboarding");

        // Show success message
        if (validMembers.length > 0) {
          toast({
            title: "Setup completed successfully!",
            description: `Your first trial and ${validMembers.length} team member(s) have been added.`,
          });
        } else {
          toast({
            title: "Setup completed successfully!",
            description:
              "Your first trial has been created. You can now start managing your research.",
          });
        }

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout currentStep={3} previousStep="/onboarding/step2">
      <section>
        <h2 className="text-2xl font-semibold mb-1">Add Team Members</h2>

        <div className="flex flex-col">
          <div className="w-full">
            <h3 className="text-xl font-medium mb-2">Create a team</h3>
            <p className="text-themison-gray mb-6">
              Invite team members to collaborate and manage your clinical trial
              setup more efficiently.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {members.map((member, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(index, "email", e.target.value)
                      }
                      placeholder="colleague@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <RoleSelector
                      value={member.role}
                      onChange={(role) => updateMember(index, "role", role)}
                      placeholder="Select role"
                    />
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="self-end p-2 mb-1 text-themison-gray hover:text-destructive"
                      aria-label="Remove team member"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addMember}
                className="flex items-center text-primary hover:text-primary-hover"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add more
              </button>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-themison-gray border border-gray-300 rounded hover:bg-gray-50"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-2 rounded transition-colors font-medium"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
};

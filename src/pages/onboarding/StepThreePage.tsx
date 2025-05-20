import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import {
  updateOnboardingStep,
  getOnboardingStatus,
} from "@/services/userService";

interface TeamMember {
  email: string;
  role: string;
}

export const StepThreePage = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { email: "", role: "Member" },
  ]);
  const [inviteToStudy, setInviteToStudy] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get study name from localStorage if available
  const onboardingStatus = getOnboardingStatus();
  const studyName = onboardingStatus?.studyInfo?.name || "your study";

  // Load saved team members if available
  useEffect(() => {
    if (onboardingStatus?.team && onboardingStatus.team.length > 0) {
      setMembers(onboardingStatus.team);
    }
  }, []);

  const addMember = () => {
    setMembers([...members, { email: "", role: "Member" }]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate emails
    const validMembers = members.filter((m) => m.email.trim() !== "");

    // Mark onboarding as completed
    updateOnboardingStep(3, validMembers);

    // In a real app, we would send invitations via an API
    if (validMembers.length > 0) {
      toast({
        title: "Team members invited",
        description: `Invitations sent to ${validMembers.length} team members`,
      });
    }

    // Navigate to dashboard
    navigate("/dashboard");
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
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) =>
                        updateMember(index, "role", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Member"
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

              <div className="flex items-center space-x-2 pt-4">
                <input
                  id="invite-to-study"
                  type="checkbox"
                  checked={inviteToStudy}
                  onChange={() => setInviteToStudy(!inviteToStudy)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="invite-to-study">
                  Invite them to {studyName}
                </label>
              </div>

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

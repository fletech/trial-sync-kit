import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import {
  updateOnboardingStep,
  getOnboardingStatus,
  saveUser,
  getUser,
} from "@/services/userService";
import storage from "@/services/storage";
import { RoleSelector, CLINICAL_ROLES } from "@/components/RoleSelector";

// Trial images array - same as in TrialsPage
const trialImages = [
  "/trials-images/pawel-czerwinski-fRzUPSFnp04-unsplash.jpg",
  "/trials-images/pawel-czerwinski-Tyg0rVhOTrE-unsplash.jpg",
  "/trials-images/laura-vinck-Hyu76loQLdk-unsplash.jpg",
  "/trials-images/pawel-czerwinski-Lki74Jj7H-U-unsplash.jpg",
  "/trials-images/pawel-czerwinski-tMbQpdguDVQ-unsplash.jpg",
  "/trials-images/daniel-olah-VS_kFx4yF5g-unsplash.jpg",
  "/trials-images/geordanna-cordero-5NE6mX0WVfQ-unsplash.jpg",
  "/trials-images/bia-w-a-PO8Woh4YBD8-unsplash.jpg",
  "/trials-images/mymind-tZCrFpSNiIQ-unsplash.jpg",
  "/trials-images/pawel-czerwinski-ruJm3dBXCqw-unsplash.jpg",
  "/trials-images/annie-spratt-0ZPSX_mQ3xI-unsplash.jpg",
  "/trials-images/usgs-hoS3dzgpHzw-unsplash.jpg",
];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Initialize localStorage if not already done
    if (!storage.isUserInitialized()) {
      storage.initializeNewUser();
    }

    // Validate emails
    const validMembers = members.filter((m) => m.email.trim() !== "");

    // Create the first trial from onboarding study info
    if (onboardingStatus?.studyInfo) {
      const { name, location, sponsor } = onboardingStatus.studyInfo;

      const firstTrial = {
        name: name,
        description: `Clinical trial created during onboarding setup. This study will be conducted in ${location}.`,
        status: "planning", // Aligned with Kanban workflow
        location: location,
        progress: 0,
        upcoming: "Upload protocols",
        pendingTask: "Assign team members",
        phase: "Phase I", // Default clinical trial phase
        image: trialImages[0],
        isNew: true,
        sponsor: sponsor,
        piContact: "Principal Investigator",
        studyStart: new Date().toLocaleDateString("en-GB"),
        estimatedCloseOut: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-GB"),
      };

      // Save the trial to localStorage
      const savedTrial = storage.saveTrial(firstTrial);

      // Associate sample documents with the new trial
      if (savedTrial) {
        const existingDocuments = storage.getTrialDocuments("demo-trial");
        existingDocuments.forEach((doc) => {
          // Update the trialId to the actual trial ID
          const updatedDoc = { ...doc, trialId: savedTrial.id };
          storage.deleteTrialDocument(doc.id); // Remove old document
          storage.saveTrialDocument(savedTrial.id, {
            name: updatedDoc.name,
            size: updatedDoc.size,
            type: updatedDoc.type,
            uploadedAt: updatedDoc.uploadedAt,
          });
        });
      }

      // Create tasks in Task Manager for this trial
      if (savedTrial) {
        const startDate = new Date();
        const upcomingDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const pendingDueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        // Create upcoming task
        const upcomingTaskObj = {
          columnId: "planning",
          trial: name,
          site: location,
          priority: "Medium",
          role: "CRA",
          owner: "Unassigned",
          dates: `${startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${upcomingDueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`,
          startDate: startDate.toISOString().split("T")[0],
          endDate: upcomingDueDate.toISOString().split("T")[0],
          parentId: null,
          dependencies: [],
          progress: 0,
          users: 1,
          files: 0,
          comments: 0,
          title: "Upload protocols",
          trialId: savedTrial.id,
          trialName: name,
          category: "Protocol",
        };

        // Create pending task
        const pendingTaskObj = {
          columnId: "planning",
          trial: name,
          site: location,
          priority: "High",
          role: "CTM",
          owner: "Unassigned",
          dates: `${startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${pendingDueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`,
          startDate: startDate.toISOString().split("T")[0],
          endDate: pendingDueDate.toISOString().split("T")[0],
          parentId: null,
          dependencies: [],
          progress: 0,
          users: 1,
          files: 0,
          comments: 0,
          title: "Assign team members",
          trialId: savedTrial.id,
          trialName: name,
          category: "Team Management",
        };

        // Save tasks to Task Manager
        storage.saveTask(upcomingTaskObj);
        storage.saveTask(pendingTaskObj);
      }

      // Create a notification for the new trial
      storage.saveNotification({
        type: "trial_update",
        title: "Welcome to THEMISON!",
        message: `Your first trial "${name}" has been created successfully. You can now start managing your clinical research.`,
      });
    }

    // Save team members to localStorage if any
    if (validMembers.length > 0) {
      validMembers.forEach((member) => {
        const teamMember = {
          name: member.email.split("@")[0], // Use email prefix as name
          email: member.email,
          role: member.role,
          status: "active",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            member.email.split("@")[0]
          )}&background=5B6CFF&color=fff`,
        };
        storage.saveTeamMember(teamMember);
      });

      // Create notification for team setup with a small delay to ensure unique timestamps
      setTimeout(() => {
        storage.saveNotification({
          type: "team_update",
          title: "Team Members Added",
          message: `${validMembers.length} team member(s) have been added to your organization.`,
        });
      }, 10);
    }

    // Save user information to user profile
    if (onboardingStatus?.userInfo) {
      const currentUser = getUser();
      const { firstName, lastName } = onboardingStatus.userInfo;

      saveUser({
        email: currentUser?.email || "",
        name: `${firstName} ${lastName}`,
        role: onboardingStatus.role || "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          firstName + " " + lastName
        )}&background=5B6CFF&color=fff`,
      });
    }

    // Mark onboarding as completed
    updateOnboardingStep(3, validMembers);

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

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { RoleSelector, CLINICAL_ROLES } from "@/components/RoleSelector";

interface TeamMember {
  email: string;
  role: string;
}

interface TeamMemberInviteProps {
  onSubmit: (members: TeamMember[]) => void;
  onCancel?: () => void;
  submitText?: string;
  showCancel?: boolean;
  initialMembers?: TeamMember[];
}

export const TeamMemberInvite = ({
  onSubmit,
  onCancel,
  submitText = "Send Invitations",
  showCancel = true,
  initialMembers = [{ email: "", role: CLINICAL_ROLES[1] }], // Clinical research coordinator
}: TeamMemberInviteProps) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

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

    // Filter out empty emails
    const validMembers = members.filter((m) => m.email.trim() !== "");
    onSubmit(validMembers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={member.email}
                onChange={(e) => updateMember(index, "email", e.target.value)}
                placeholder="colleague@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1">Role</label>
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
                className="self-end p-2 mb-1 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Remove team member"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMember}
        className="flex items-center text-primary hover:text-primary-hover transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add more
      </button>

      <div className="flex justify-end space-x-4 pt-4">
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-2 rounded transition-colors font-medium"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

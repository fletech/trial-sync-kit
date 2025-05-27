import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  Plus,
  Search,
  Mail,
  Shield,
  Eye,
  User,
  Users,
  Edit,
} from "lucide-react";
import { RoleSelector, CLINICAL_ROLES } from "@/components/RoleSelector";
import storage from "@/services/storage";
import { TeamMemberInvite } from "@/components/TeamMemberInvite";
import { notificationEvents } from "@/hooks/useNotifications";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar: string;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Principal investigator":
      return <Shield className="h-4 w-4" />;
    case "Clinical research coordinator":
      return <User className="h-4 w-4" />;
    case "Physician/doctor/PhD student":
      return <Users className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Principal investigator":
      return "bg-themison-error/10 text-themison-error border-themison-error/20 hover:bg-themison-error/15 transition-colors";
    case "Clinical research coordinator":
      return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors";
    case "Physician/doctor/PhD student":
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-150 transition-colors";
    default:
      return "bg-surface text-secondary border-secondary/20 hover:bg-secondary/10 transition-colors";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success-soft text-success border-success/20 hover:bg-success/10 transition-colors";
    case "inactive":
      return "bg-surface text-secondary border-secondary/20 hover:bg-secondary/10 transition-colors";
    default:
      return "bg-surface text-secondary border-secondary/20 hover:bg-secondary/10 transition-colors";
  }
};

interface InviteMember {
  email: string;
  role: string;
}

export const OrganizationPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Load team members
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    const members = storage.getTeamMembers();
    setTeamMembers(members);
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteMembers = (members: InviteMember[]) => {
    if (members.length === 0) {
      toast.error("Please add at least one member with a valid email");
      return;
    }

    // Keep role names as they are
    const normalizedMembers = members.map((member) => ({
      name: member.email.split("@")[0], // Use email prefix as name for now
      email: member.email,
      role: member.role,
      status: "active" as const,
      avatar: "/api/placeholder/40/40",
    }));

    // Save all members
    normalizedMembers.forEach((member) => {
      storage.saveTeamMember(member);

      // Create notification for each new member
      storage.saveNotification({
        type: "team_update",
        title: "New Team Member Added",
        message: `${member.name} (${member.email}) has been added to the team as ${member.role}`,
      });
    });

    loadTeamMembers();
    setIsInviteModalOpen(false);

    // Emit event to update notification count
    notificationEvents.emit();

    toast.success(
      `${members.length} member${
        members.length > 1 ? "s" : ""
      } have been added to the team`
    );
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;

    storage.updateTeamMember(editingMember.id, {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    });

    // Create notification for member update
    storage.saveNotification({
      type: "team_update",
      title: "Team Member Updated",
      message: `${editForm.name}'s information has been updated`,
    });

    // Emit event to update notification count
    notificationEvents.emit();

    loadTeamMembers();
    setIsEditModalOpen(false);
    setEditingMember(null);

    toast.success("Member information has been updated successfully");
  };

  const handleStatusToggle = (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    storage.updateTeamMember(memberId, { status: newStatus });
    loadTeamMembers();

    toast.success(
      `Member has been ${newStatus === "active" ? "activated" : "deactivated"}`
    );
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    storage.deleteTeamMember(memberId);

    // Create notification for member removal
    storage.saveNotification({
      type: "team_update",
      title: "Team Member Removed",
      message: `${memberName} has been removed from the team`,
    });

    // Emit event to update notification count
    notificationEvents.emit();

    loadTeamMembers();

    toast.success(`${memberName} has been removed from the team`);
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Organisation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">
            Team & Roles
          </h1>
          <p className="text-gray-600 text-base">
            {filteredMembers.length} team members
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#10121C] hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Invite Team Members</DialogTitle>
                <DialogDescription>
                  Add new members to your organization. They will receive
                  invitation emails.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <TeamMemberInvite
                  onSubmit={handleInviteMembers}
                  onCancel={() => setIsInviteModalOpen(false)}
                  submitText="Send Invitations"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update member information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Member name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="member@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <RoleSelector
                value={editForm.role}
                onChange={(role) => setEditForm({ ...editForm, role })}
                placeholder="Select role"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>Update Member</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={`${getRoleColor(
                        member.role
                      )} flex items-center w-fit`}
                    >
                      {getRoleIcon(member.role)}
                      <span className="ml-1 capitalize">{member.role}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(member.status)}
                    >
                      <span className="capitalize">{member.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                      className="text-primary hover:text-primary-hover"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by inviting your first team member"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizationPage;

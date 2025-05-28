import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import storage from "@/services/storage";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar: string;
}

interface TaskAssigneeSelectorProps {
  value: string;
  onChange: (assignee: string) => void;
  disabled?: boolean;
}

export const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const members = storage.getTeamMembers();
    // Only show active members
    const activeMembers = members.filter(
      (member) => member.status === "active"
    );
    setTeamMembers(activeMembers);
  }, []);

  const selectedMember = teamMembers.find((member) => member.name === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select assignee">
          {value === "Unassigned" ? (
            <span className="text-gray-500">Unassigned</span>
          ) : selectedMember ? (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                />
                <AvatarFallback className="text-xs">
                  {selectedMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{selectedMember.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Select assignee</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg">
        <SelectItem value="Unassigned">
          <span className="text-gray-500">Unassigned</span>
        </SelectItem>
        {teamMembers.map((member) => (
          <SelectItem key={member.id} value={member.name}>
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-gray-500">{member.role}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

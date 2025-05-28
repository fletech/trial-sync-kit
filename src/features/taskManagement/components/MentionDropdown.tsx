import React, { useState, useEffect, useRef } from "react";
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

interface MentionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (member: TeamMember) => void;
  searchQuery: string;
  position: { top: number; left: number };
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  isOpen,
  onClose,
  onSelect,
  searchQuery,
  position,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const members = storage.getTeamMembers();
    const activeMembers = members.filter(
      (member) => member.status === "active"
    );
    setTeamMembers(activeMembers);
  }, []);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, filteredMembers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredMembers.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredMembers.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredMembers.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredMembers[selectedIndex]) {
            onSelect(filteredMembers[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredMembers, selectedIndex, onSelect, onClose]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || filteredMembers.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
      style={{
        top: position.top,
        left: position.left,
        width: "240px",
        maxWidth: "240px",
      }}
    >
      {filteredMembers.map((member, index) => (
        <div
          key={member.id}
          className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
            index === selectedIndex ? "bg-blue-50" : ""
          }`}
          onClick={() => onSelect(member)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
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
            <span className="text-sm font-medium">{member.name}</span>
            <span className="text-xs text-gray-500">{member.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

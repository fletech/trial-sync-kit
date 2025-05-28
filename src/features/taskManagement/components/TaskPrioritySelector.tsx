import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskPrioritySelectorProps {
  value: string;
  onChange: (priority: string) => void;
  disabled?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "High", label: "High", color: "bg-red-100 text-red-600" },
];

export const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const selectedPriority = PRIORITY_OPTIONS.find(
    (option) => option.value === value
  );

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedPriority && (
            <div className="flex items-center">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${selectedPriority.color}`}
              >
                {selectedPriority.label}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg">
        {PRIORITY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${option.color}`}
              >
                {option.label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

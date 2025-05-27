import { ChevronDown } from "lucide-react";

export const CLINICAL_ROLES = [
  "Principal investigator",
  "Clinical research coordinator",
  "Physician/doctor/PhD student",
];

interface RoleSelectorProps {
  value: string;
  onChange: (role: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RoleSelector = ({
  value,
  onChange,
  placeholder = "Select your role",
  className = "",
  disabled = false,
}: RoleSelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
        !value ? "text-gray-500" : "text-gray-900"
      } ${className}`}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {CLINICAL_ROLES.map((role) => (
        <option key={role} value={role} className="text-gray-900">
          {role}
        </option>
      ))}
    </select>
  );
};

// Trial Constants - Unified definitions across the application

// PHASES - Fixed trial types (clinical trial phases)
export const TRIAL_PHASES = [
  "Phase I",
  "Phase II",
  "Phase III",
  "Phase IV",
  "Observational",
  "Registry",
] as const;

// STATUS - Dynamic workflow aligned with Kanban columns
export const TRIAL_STATUSES = [
  { id: "planning", name: "Planning", color: "#2563eb" },
  { id: "regulatory", name: "Regulatory Prep", color: "#6366f1" },
  { id: "site-initiation", name: "Site Initiation", color: "#0ea5e9" },
  { id: "recruiting", name: "Recruiting", color: "#22c55e" },
  { id: "study", name: "Study Conduct", color: "#f59e42" },
  { id: "completed", name: "Completed", color: "#6b7280" },
] as const;

// LOCATIONS
export const TRIAL_LOCATIONS = [
  "Milano",
  "Bergamo",
  "Torino",
  "Castellanza",
  "Catania",
] as const;

// Filter options for UI
export const PHASE_FILTER_OPTIONS = ["All phases", ...TRIAL_PHASES];
export const STATUS_FILTER_OPTIONS = [
  "All statuses",
  ...TRIAL_STATUSES.map((s) => s.name),
];
export const LOCATION_FILTER_OPTIONS = ["All places", ...TRIAL_LOCATIONS];

// Kanban columns (same as TRIAL_STATUSES but excluding completed for active workflow)
export const KANBAN_COLUMNS = TRIAL_STATUSES.filter(
  (status) => status.id !== "completed"
);

// Type definitions
export type TrialPhase = (typeof TRIAL_PHASES)[number];
export type TrialStatusId = (typeof TRIAL_STATUSES)[number]["id"];
export type TrialStatusName = (typeof TRIAL_STATUSES)[number]["name"];
export type TrialLocation = (typeof TRIAL_LOCATIONS)[number];

// Data migration utility to update existing localStorage data to new unified constants
import {
  TRIAL_STATUSES,
  TRIAL_PHASES,
  TRIAL_LOCATIONS,
} from "@/constants/trialConstants";

// Legacy status mapping to new status IDs
const STATUS_MIGRATION_MAP: Record<string, string> = {
  Planning: "planning",
  Recruiting: "recruiting",
  Active: "study",
  Randomization: "recruiting",
  Completed: "completed",
  "Study start-up": "planning",
  Recruitment: "recruiting",
  "Screening visit": "recruiting",
  "Routine visit": "study",
  "Close-out": "completed",
};

// Legacy phase mapping to new clinical trial phases
const PHASE_MIGRATION_MAP: Record<string, string> = {
  "Study start-up": "Phase I",
  Recruitment: "Phase I",
  "Screening visit": "Phase I",
  "Routine visit": "Phase II",
  "Close-out": "Phase III",
};

export function migrateTrialData() {
  try {
    const trials = JSON.parse(localStorage.getItem("trials") || "[]");
    let migrated = false;

    const migratedTrials = trials.map((trial: any) => {
      let updated = { ...trial };

      // Migrate status
      if (trial.status && STATUS_MIGRATION_MAP[trial.status]) {
        updated.status = STATUS_MIGRATION_MAP[trial.status];
        migrated = true;
      }

      // Migrate phase
      if (trial.phase && PHASE_MIGRATION_MAP[trial.phase]) {
        updated.phase = PHASE_MIGRATION_MAP[trial.phase];
        migrated = true;
      }

      // Ensure location is valid
      if (trial.location && !TRIAL_LOCATIONS.includes(trial.location as any)) {
        updated.location = "Milano"; // Default fallback
        migrated = true;
      }

      return updated;
    });

    if (migrated) {
      localStorage.setItem("trials", JSON.stringify(migratedTrials));
      console.log("Trial data migrated successfully");
    }

    return migrated;
  } catch (error) {
    console.error("Error migrating trial data:", error);
    return false;
  }
}

// Migrate notification IDs to ensure uniqueness
export function migrateNotificationIds() {
  try {
    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    let migrated = false;

    // Check if any notifications have duplicate IDs or simple timestamp IDs
    const idCounts = {};
    notifications.forEach((notification: any) => {
      idCounts[notification.id] = (idCounts[notification.id] || 0) + 1;
    });

    const hasDuplicates = Object.values(idCounts).some(
      (count: any) => count > 1
    );
    const hasSimpleIds = notifications.some((n: any) => !n.id.includes("-"));

    if (hasDuplicates || hasSimpleIds) {
      console.log("Migrating notification IDs to ensure uniqueness...");

      const migratedNotifications = notifications.map(
        (notification: any, index: number) => {
          const uniqueId = `${Date.now() + index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          return {
            ...notification,
            id: uniqueId,
          };
        }
      );

      localStorage.setItem(
        "notifications",
        JSON.stringify(migratedNotifications)
      );
      migrated = true;
      console.log("Notification IDs migrated successfully");
    }

    return migrated;
  } catch (error) {
    console.error("Error migrating notification IDs:", error);
    return false;
  }
}

// Run migration on app startup
export function runDataMigrations() {
  const migrationVersion = localStorage.getItem("migration_version");

  if (migrationVersion !== "1.1") {
    console.log("Running data migrations...");
    migrateTrialData();
    migrateNotificationIds();
    localStorage.setItem("migration_version", "1.1");
  }
}

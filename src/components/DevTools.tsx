import { useState, useEffect } from "react";
import storage from "@/services/storage";

export const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsEnabled(!!(window as any).devToolsEnabled);

    // Listen for custom events when dev tools are toggled
    const handleDevToolsToggle = () => {
      setIsEnabled(!!(window as any).devToolsEnabled);
    };

    window.addEventListener("devToolsToggled", handleDevToolsToggle);

    return () => {
      window.removeEventListener("devToolsToggled", handleDevToolsToggle);
    };
  }, []);

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const logCurrentData = () => {
    console.log("=== Current localStorage data ===");
    console.log("Trials:", storage.getTrials());
    console.log("Team:", storage.getTeamMembers());
    console.log("Notifications:", storage.getNotifications());
    console.log(
      "Onboarding:",
      JSON.parse(localStorage.getItem("themison_onboarding") || "null")
    );
    console.log(
      "User:",
      JSON.parse(localStorage.getItem("themison_user") || "null")
    );
    console.log("Initialized:", localStorage.getItem("themison_initialized"));
  };

  const resetOnboarding = () => {
    localStorage.removeItem("themison_onboarding");
    localStorage.removeItem("themison_initialized");
    window.location.href = "/onboarding/step1";
  };

  // Only show when explicitly enabled
  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg hover:bg-red-600"
      >
        Dev Tools
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
          <h3 className="font-medium text-gray-900 mb-3">Development Tools</h3>
          <div className="space-y-2">
            <button
              onClick={logCurrentData}
              className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              Log Current Data
            </button>
            <button
              onClick={resetOnboarding}
              className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
            >
              Reset Onboarding
            </button>
            <button
              onClick={clearAllData}
              className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

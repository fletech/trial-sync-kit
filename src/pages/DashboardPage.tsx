import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { FlaskConical, CheckSquare, Users, User, Plus } from "lucide-react";
import { getCurrentUser, getUserFromDB } from "@/services/userService";
import storage from "@/services/storage";

export const DashboardPage = () => {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [metrics, setMetrics] = useState([
    { label: "Active studies", value: 0, color: "text-gray-900" },
    { label: "Tasks overdue", value: 0, color: "text-red-500" },
    { label: "Visits today", value: 0, color: "text-gray-900" },
    { label: "AE", value: 0, color: "text-yellow-500" },
    { label: "SAE", value: 0, color: "text-red-500" },
  ]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user data from database
        const { user, profile } = await getUserFromDB();

        if (profile && profile.first_name) {
          setUserName(profile.first_name);
        } else if (user?.email) {
          // Fallback to email prefix if no name
          setUserName(user.email.split("@")[0]);
        } else {
          setUserName("User");
        }

        // For now, hardcode role - later we can get it from team_members
        setUserRole("Admin");
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserName("User");
        setUserRole("Admin");
      }
    };

    const loadMetrics = async () => {
      try {
        // Get trials from database (with RLS applied)
        const trials = await storage.getTrials();

        // Update metrics with real data
        setMetrics([
          {
            label: "Active studies",
            value: trials.length,
            color: "text-gray-900",
          },
          { label: "Tasks overdue", value: 0, color: "text-red-500" }, // TODO: calculate from tasks
          { label: "Visits today", value: 0, color: "text-gray-900" }, // TODO: calculate from schedules
          { label: "AE", value: 0, color: "text-yellow-500" }, // TODO: calculate from adverse events
          { label: "SAE", value: 0, color: "text-red-500" }, // TODO: calculate from serious adverse events
        ]);
      } catch (error) {
        console.error("Error loading metrics:", error);
        // Keep default values if error
      }
    };

    loadUserData();
    loadMetrics();
  }, []);

  const quickLinks = [
    {
      title: "Trials",
      description: "View and manage your clinical trials.",
      href: "/trials",
      icon: <FlaskConical className="h-6 w-6 text-primary" />,
    },
    {
      title: "Tasks",
      description: "Check your pending tasks and deadlines.",
      href: "/task-manager",
      icon: <CheckSquare className="h-6 w-6 text-primary" />,
    },
    {
      title: "Organization",
      description: "Manage your team and organization info.",
      href: "/organization",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Profile",
      description: "Update your personal information.",
      href: "/profile",
      icon: <User className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Hello, {userName}
          </h1>
          <p className="text-gray-600">How would you like to start your day?</p>
        </div>

        {/* Metrics Row */}
        <div className="flex space-x-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Card */}
          <div className="lg:col-span-1">
            <div
              className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl overflow-hidden h-[60vh] w-[30vw] flex flex-col justify-between text-white p-6"
              style={{
                backgroundImage: "url('/assets/image-card.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">
                  Let's get your study started
                </h3>
                <p className="text-blue-100 mb-4">
                  To Begin Working With The Entire Platform You Must Upload A
                  Protocol In OPERA Trial.
                </p>
              </div>
              <button className="relative z-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 self-start">
                <Plus className="h-4 w-4" />
                Upload a Document in OPERA Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  CheckSquare,
  Users,
  Bell,
  Settings,
  ExternalLink,
  HelpCircle,
  LogOut,
  Menu,
  ChevronRight,
  X,
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Zap,
} from "lucide-react";
import { getUser, logout } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useTrialContext } from "@/contexts/TrialContext";

interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  target?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const NavItem = ({
  to,
  icon,
  label,
  target,
  onClick,
  isActive,
}: NavItemProps) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left
          ${
            isActive
              ? "bg-[#E9ECEF] text-themison-text"
              : "text-themison-gray hover:bg-gray-100"
          }
        `}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to || "#"}
      target={target}
      className={({ isActive: navIsActive }) => `
        flex items-center px-4 py-3 text-sm font-medium rounded-md
        ${
          navIsActive || isActive
            ? "bg-[#E9ECEF] text-themison-text"
            : "text-themison-gray hover:bg-gray-100"
        }
      `}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const NotificationsNavItem = ({ open }: { open: boolean }) => {
  const { unreadCount } = useNotifications();

  return (
    <NavLink
      to="/notifications"
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-sm font-medium rounded-md relative
        ${
          isActive
            ? "bg-[#E9ECEF] text-themison-text"
            : "text-themison-gray hover:bg-gray-100"
        }
      `}
    >
      <span className="mr-3">
        <Bell className="h-5 w-5" />
      </span>
      {open && (
        <span className="relative">
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      )}
      {!open && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </NavLink>
  );
};

interface DynamicSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const DynamicSidebar = ({ open, onToggle }: DynamicSidebarProps) => {
  const [userData, setUserData] = useState({
    name: "Guest User",
    role: "Guest",
    avatar: "/placeholder.svg",
    email: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { trialId } = useParams<{ trialId: string }>();
  const { selectedTrial, isTrialView, setSelectedTrial } = useTrialContext();

  // Determine current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes("/task-manager")) return "task-management";
    if (path.includes("/document-assistant")) return "document-assistant";
    if (path.includes("/team-roles")) return "team-roles";
    if (path.includes("/notifications")) return "notifications";
    if (path.includes("/integrations")) return "integrations";
    return "overview";
  };

  const currentTrialSection = getCurrentSection();

  // Dispatch event when trial section changes
  useEffect(() => {
    if (isTrialView && currentTrialSection) {
      window.dispatchEvent(
        new CustomEvent("trialSectionChanged", {
          detail: { section: currentTrialSection },
        })
      );
    }
  }, [currentTrialSection, isTrialView]);

  useEffect(() => {
    // Get user data from localStorage
    const user = getUser();
    if (user) {
      setUserData({
        name: user.name || "Guest User",
        role: user.role || "Guest",
        avatar: user.avatar || "/placeholder.svg",
        email: user.email || "",
      });
    }
  }, []);

  // Listen for user data changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = getUser();
      if (user) {
        setUserData({
          name: user.name || "Guest User",
          role: user.role || "Guest",
          avatar: user.avatar || "/placeholder.svg",
          email: user.email || "",
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userDataUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userDataUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      e.preventDefault();
      (window as any).devToolsEnabled = !(window as any).devToolsEnabled;
      window.dispatchEvent(new CustomEvent("devToolsToggled"));

      const isEnabled = (window as any).devToolsEnabled;
      toast({
        title: isEnabled ? "Dev Tools Enabled" : "Dev Tools Disabled",
        description: isEnabled
          ? "Dev tools are now visible"
          : "Dev tools are now hidden",
        variant: "info",
      });
    }
  };

  const handleBackToTrials = () => {
    setSelectedTrial(null);
    navigate("/trials");
  };

  const handleTrialSectionClick = (section: string) => {
    if (!trialId) return;

    // Navigate to the specific route based on section
    switch (section) {
      case "overview":
        navigate(`/trials/${trialId}`);
        break;
      case "task-management":
        navigate(`/trials/${trialId}/task-manager`);
        break;
      case "document-assistant":
        navigate(`/trials/${trialId}/document-assistant`);
        break;
      case "team-roles":
        navigate(`/trials/${trialId}/team-roles`);
        break;
      case "notifications":
        navigate(`/trials/${trialId}/notifications`);
        break;
      case "integrations":
        navigate(`/trials/${trialId}/integrations`);
        break;
      default:
        navigate(`/trials/${trialId}`);
    }
  };

  // Regular sidebar navigation items
  const regularNavItems = (
    <>
      <div
        className={`mb-1 px-4 text-xs font-medium text-themison-gray ${
          !open && "lg:hidden"
        }`}
      >
        Main menu
      </div>
      <nav className="space-y-1 mb-6">
        <NavItem
          to="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label={open ? "Home" : ""}
        />
        <NavItem
          to="/trials"
          icon={<FileText className="h-5 w-5" />}
          label={open ? "Trials" : ""}
        />
        <NavItem
          to="/task-manager"
          icon={<CheckSquare className="h-5 w-5" />}
          label={open ? "Tasks" : ""}
        />
        <NavItem
          to="/organisation"
          icon={<Users className="h-5 w-5" />}
          label={open ? "Organisation" : ""}
        />
        <NotificationsNavItem open={open} />
        <NavItem
          to="/integrations"
          icon={<ExternalLink className="h-5 w-5" />}
          label={open ? "Integrations" : ""}
        />
      </nav>
    </>
  );

  // Trial-specific navigation items
  const trialNavItems = (
    <>
      <div className="mb-4">
        <button
          onClick={handleBackToTrials}
          className="flex items-center px-4 py-2 text-sm font-medium text-themison-gray hover:bg-gray-100 rounded-md w-full text-left"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {open && "Back to Trials"}
        </button>
      </div>

      {open && selectedTrial && (
        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold text-themison-text truncate">
            {selectedTrial.name}
          </h3>
          <p className="text-xs text-themison-gray">
            {selectedTrial.phase} • {selectedTrial.location}
          </p>
        </div>
      )}

      <nav className="space-y-1 mb-6">
        <NavItem
          icon={<BarChart3 className="h-5 w-5" />}
          label={open ? "Overview" : ""}
          onClick={() => handleTrialSectionClick("overview")}
          isActive={currentTrialSection === "overview"}
        />
        <NavItem
          icon={<CheckSquare className="h-5 w-5" />}
          label={open ? "Task Management" : ""}
          onClick={() => handleTrialSectionClick("task-management")}
          isActive={currentTrialSection === "task-management"}
        />
        <NavItem
          icon={<FileText className="h-5 w-5" />}
          label={open ? "Document Assistant" : ""}
          onClick={() => handleTrialSectionClick("document-assistant")}
          isActive={currentTrialSection === "document-assistant"}
        />
        <NavItem
          icon={<Users className="h-5 w-5" />}
          label={open ? "Team & Roles" : ""}
          onClick={() => handleTrialSectionClick("team-roles")}
          isActive={currentTrialSection === "team-roles"}
        />
        <NavItem
          icon={<Bell className="h-5 w-5" />}
          label={open ? "Notifications" : ""}
          onClick={() => handleTrialSectionClick("notifications")}
          isActive={currentTrialSection === "notifications"}
        />
        <NavItem
          icon={<Zap className="h-5 w-5" />}
          label={open ? "Integrations" : ""}
          onClick={() => handleTrialSectionClick("integrations")}
          isActive={currentTrialSection === "integrations"}
        />
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md"
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        lg:relative lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h1
              className={`text-xl font-bold text-primary cursor-pointer select-none ${
                !open && "lg:hidden"
              }`}
              onClick={handleLogoClick}
              title="Hold Option/Alt and click to toggle dev tools"
            >
              THEMISON
            </h1>
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4 px-3">
            {isTrialView ? trialNavItems : regularNavItems}

            <div
              className={`mb-1 px-4 text-xs font-medium text-themison-gray ${
                !open && "lg:hidden"
              }`}
            >
              Others
            </div>
            <nav className="space-y-1">
              <NavItem
                to="https://www.themison.com/#features"
                target="_blank"
                icon={<HelpCircle className="h-5 w-5" />}
                label={open ? "Help" : ""}
              />
              <NavItem
                to="/settings"
                icon={<Settings className="h-5 w-5" />}
                label={open ? "Settings" : ""}
              />
              <button
                onClick={handleLogout}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left
                  text-themison-gray hover:bg-gray-100
                `}
              >
                <span className="mr-3">
                  <LogOut className="h-5 w-5" />
                </span>
                {open && <span>Log out</span>}
              </button>
            </nav>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {open && (
                <div>
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-themison-gray">
                    {userData.email || userData.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

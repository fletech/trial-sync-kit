
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  X
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center px-4 py-3 text-sm font-medium rounded-md
      ${isActive 
        ? 'bg-primary text-white' 
        : 'text-themison-gray hover:bg-gray-100'
      }
    `}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const [user] = useState({
    name: 'Terry Dorwart',
    role: 'Admin',
    avatar: '/placeholder.svg'
  });
  
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onToggle} />
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
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className={`text-xl font-bold text-primary ${!open && 'lg:hidden'}`}>
              THEMISON
            </h1>
            <button 
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4 px-3">
            <div className={`mb-1 px-4 text-xs font-medium text-themison-gray ${!open && 'lg:hidden'}`}>
              Main menu
            </div>
            <nav className="space-y-1 mb-6">
              <NavItem to="/dashboard" icon={<Home className="h-5 w-5" />} label={open ? "Home" : ""} />
              <NavItem to="/trials" icon={<FileText className="h-5 w-5" />} label={open ? "Trials" : ""} />
              <NavItem to="/tasks" icon={<CheckSquare className="h-5 w-5" />} label={open ? "Tasks" : ""} />
              <NavItem to="/organisation" icon={<Users className="h-5 w-5" />} label={open ? "Organisation" : ""} />
              <NavItem to="/notifications" icon={<Bell className="h-5 w-5" />} label={open ? "Notifications" : ""} />
              <NavItem to="/integrations" icon={<ExternalLink className="h-5 w-5" />} label={open ? "Integrations" : ""} />
            </nav>
            
            <div className={`mb-1 px-4 text-xs font-medium text-themison-gray ${!open && 'lg:hidden'}`}>
              Others
            </div>
            <nav className="space-y-1">
              <NavItem to="/help" icon={<HelpCircle className="h-5 w-5" />} label={open ? "Help" : ""} />
              <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label={open ? "Settings" : ""} />
              <NavItem to="/logout" icon={<LogOut className="h-5 w-5" />} label={open ? "Log out" : ""} />
            </nav>
          </div>
          
          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="h-8 w-8 rounded-full mr-3"
              />
              {open && (
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-themison-gray">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { FlaskConical, CheckSquare, Users, User } from "lucide-react";

const quickLinks = [
  {
    title: "Trials",
    description: "View and manage your clinical trials.",
    href: "/trials",
    icon: <FlaskConical className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Tasks",
    description: "Check your pending tasks and deadlines.",
    href: "/task-manager",
    icon: <CheckSquare className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Organization",
    description: "Manage your team and organization info.",
    href: "/organization",
    icon: <Users className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Profile",
    description: "Update your personal information.",
    href: "/profile",
    icon: <User className="h-8 w-8 text-primary mb-2" />,
  },
];

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">
          Welcome to Themison
        </h1>
        <p className="text-themison-gray text-lg mb-6">
          Quick access to your most important actions.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-7 shadow-sm hover:shadow-lg transition-shadow group hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {link.icon}
            <h2 className="text-lg font-semibold mb-1 text-gray-900 group-hover:text-primary transition-colors">
              {link.title}
            </h2>
            <p className="text-themison-gray text-sm text-center">
              {link.description}
            </p>
          </a>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

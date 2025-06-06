import { ReactNode, useState } from "react";
import { DynamicSidebar } from "@/components/DynamicSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-themison-bg-gray">
      <DynamicSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-8 mx-auto max-w-7xl">{children}</main>
      </div>
    </div>
  );
};

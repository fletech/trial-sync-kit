import React, { useState } from "react";
import { columns } from "@/features/taskManagement/mocks/kanbanData";
import { KanbanBoard } from "@/features/taskManagement/components/KanbanBoard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskProvider } from "@/features/taskManagement/context/TaskContext";
import FrappeGanttChart from "@/features/taskManagement/components/FrappeGanttChart";

const TaskManagementPage: React.FC = () => {
  const [tab, setTab] = useState("kanban");

  return (
    <TaskProvider>
      <DashboardLayout>
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="kanban">Kanban board</TabsTrigger>
                <TabsTrigger value="gantt">Gantt chart</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" className="ml-2">
              + Add New View
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="Filter or search..."
              className="w-full md:w-64"
            />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {tab === "kanban" && <KanbanBoard columns={columns} />}
        {tab === "gantt" && <FrappeGanttChart />}
        {/* Puedes agregar aquí los otros tabs si lo deseas */}
      </DashboardLayout>
    </TaskProvider>
  );
};

export { TaskManagementPage };

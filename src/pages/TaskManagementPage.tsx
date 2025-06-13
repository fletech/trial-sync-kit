import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { columns } from "@/features/taskManagement/mocks/kanbanData";
import { KanbanBoard } from "@/features/taskManagement/components/KanbanBoard";
import { TaskDetailsDrawer } from "@/features/taskManagement/components/TaskDetailsDrawer";
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
import { TaskProvider, useTasks } from "@/contexts/TaskContext";
import FrappeGanttChart from "@/features/taskManagement/components/FrappeGanttChart";
import storage from "@/services/storage";
import { useToast } from "@/hooks/use-toast";
import { Shuffle } from "lucide-react";

const TaskManagementContent: React.FC = () => {
  const [tab, setTab] = useState("kanban");
  const { tasks, setTasks, selectedTask, isTaskDrawerOpen, closeTaskDetails } =
    useTasks();
  const { toast } = useToast();
  const { trialId } = useParams<{ trialId: string }>();
  const location = useLocation();

  // Determine if we're in a trial-specific context
  const isTrialSpecific = location.pathname.includes("/trials/") && trialId;

  // Get trial information if we're in trial-specific context
  const currentTrial = isTrialSpecific
    ? storage.getTrials().find((t) => t.id === trialId)
    : null;

  // Filter tasks based on context
  const filteredTasks =
    isTrialSpecific && currentTrial
      ? tasks.filter((task) => task.trialId === trialId)
      : tasks;

  const generateRandomTasks = () => {
    const trials = storage.getTrials();

    if (trials.length === 0) {
      toast({
        title: "No trials found",
        description: "Please create some trials first before generating tasks.",
        variant: "destructive",
      });
      return;
    }

    const taskTemplates = [
      {
        title: "Protocol Review and Approval",
        columnId: "planning",
        priority: "High",
        role: "CRA",
        duration: 7,
      },
      {
        title: "Site Initiation Visit",
        columnId: "site-initiation",
        priority: "High",
        role: "CTM",
        duration: 3,
      },
      {
        title: "Patient Screening",
        columnId: "recruiting",
        priority: "Medium",
        role: "CRA",
        duration: 14,
      },
      {
        title: "Regulatory Documentation",
        columnId: "regulatory",
        priority: "High",
        role: "CRA",
        duration: 10,
      },
      {
        title: "Data Collection and Entry",
        columnId: "study",
        priority: "Medium",
        role: "CRA",
        duration: 5,
      },
      {
        title: "Adverse Event Reporting",
        columnId: "study",
        priority: "High",
        role: "CTM",
        duration: 2,
      },
      {
        title: "Quality Assurance Review",
        columnId: "study",
        priority: "Medium",
        role: "CRA",
        duration: 4,
      },
    ];

    const owners = [
      "Dr. Maria Alvarez",
      "Dr. Emily Tran",
      "Dr. Alex Meier",
      "Dr. Giulia Romano",
      "Dr. Chloe Mendes",
      "Dr. Elena Conti",
      "Dr. Marco Vitale",
    ];

    const sites = [
      "Humanitas Milano",
      "Humanitas Torino",
      "Humanitas Bergamo",
      "Humanitas Catania",
      "Humanitas Roma",
    ];

    // If we're in trial-specific context, generate tasks only for that trial
    const targetTrials =
      isTrialSpecific && currentTrial ? [currentTrial] : trials;
    const numberOfTasks = Math.floor(Math.random() * 2) + 4; // 4-5 tasks
    const newTasks = [];

    for (let i = 0; i < numberOfTasks; i++) {
      const template =
        taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const trial =
        targetTrials[Math.floor(Math.random() * targetTrials.length)];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const site = sites[Math.floor(Math.random() * sites.length)];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)); // Start within next 30 days

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + template.duration);

      const task = {
        id: `task_${Date.now()}_${i}`,
        columnId: template.columnId,
        trial: trial.name,
        site: site,
        priority: template.priority,
        role: template.role,
        owner: owner,
        dates: `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        parentId: null,
        dependencies: [],
        users: Math.floor(Math.random() * 5) + 2, // 2-6 users
        files: Math.floor(Math.random() * 8) + 1, // 1-8 files
        comments: Math.floor(Math.random() * 10) + 1, // 1-10 comments
        title: template.title,
        description: `This is a sample description for ${template.title}. This task is part of the ${trial.name} trial and needs to be completed by the assigned team member.`,
        trialId: trial.id,
        trialName: trial.name,
      };

      newTasks.push(task);
    }

    // Get existing tasks and add new ones
    const existingTasks = storage.getTasks();
    const allTasks = [...existingTasks, ...newTasks];

    // Save to storage and update context
    storage.saveTasks(allTasks);
    setTasks(allTasks);

    const contextMessage =
      isTrialSpecific && currentTrial
        ? `${numberOfTasks} new tasks have been created for ${currentTrial.name}.`
        : `${numberOfTasks} new tasks have been created and assigned to your trials.`;

    toast({
      title: "Random tasks generated!",
      description: contextMessage,
    });
  };

  // Custom breadcrumb for trial-specific context
  const renderBreadcrumb = () => {
    if (isTrialSpecific && currentTrial) {
      return (
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/trials">Trials</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/trials/${trialId}`}>
                  {currentTrial.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      );
    }

    return (
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
    );
  };

  // Custom title based on context
  const getTitle = () => {
    if (isTrialSpecific && currentTrial) {
      return `${currentTrial.name} - Tasks`;
    }
    return "Task Management";
  };

  const getSubtitle = () => {
    if (isTrialSpecific && currentTrial) {
      return `${filteredTasks.length} tasks for this trial`;
    }
    return `${filteredTasks.length} total tasks across all trials`;
  };

  return (
    <DashboardLayout>
      {renderBreadcrumb()}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">
            {getTitle()}
          </h1>
          <p className="text-themison-gray text-base">{getSubtitle()}</p>
        </div>
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
          <Button
            variant="outline"
            size="sm"
            className="ml-2 flex items-center gap-2"
            onClick={generateRandomTasks}
          >
            <Shuffle className="h-4 w-4" />
            {isTrialSpecific
              ? "Generate Tasks for Trial"
              : "Generate Random Tasks"}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto mb-6">
        <Input placeholder="Filter or search..." className="w-full md:w-64" />
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {tab === "kanban" && (
        <KanbanBoard columns={columns} filteredTasks={filteredTasks} />
      )}
      {tab === "gantt" && <FrappeGanttChart filteredTasks={filteredTasks} />}

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        isOpen={isTaskDrawerOpen}
        onClose={closeTaskDetails}
        task={selectedTask}
      />
    </DashboardLayout>
  );
};

const TaskManagementPage: React.FC = () => {
  return (
    <TaskProvider>
      <TaskManagementContent />
    </TaskProvider>
  );
};

export { TaskManagementPage };

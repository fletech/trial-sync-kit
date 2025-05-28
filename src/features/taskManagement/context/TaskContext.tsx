import React, { createContext, useContext, useState, useEffect } from "react";
import storage from "@/services/storage";

interface Task {
  id: string;
  columnId: string;
  trial: string;
  site: string;
  priority: string;
  role: string;
  owner: string;
  dates: string;
  startDate: string;
  endDate: string;
  parentId: string | null;
  dependencies: string[];
  users: number;
  files: number;
  comments: number;
  title: string;
  description?: string;
  archived?: boolean;
  trialId?: string;
  trialName?: string;
}

interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  authorAvatar: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isTaskDrawerOpen: boolean;
  setIsTaskDrawerOpen: (open: boolean) => void;
  openTaskDetails: (task: Task) => void;
  closeTaskDetails: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  useEffect(() => {
    // Load tasks
    loadTasks();
  }, []);

  const loadTasks = () => {
    const data = storage.getTasks();
    setTasks(data);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTask = storage.updateTask(id, updates);
    if (updatedTask) {
      loadTasks(); // Reload tasks from storage
      // Update selected task if it's the one being updated
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updatedTask);
      }
    }
  };

  const saveTasks = (newTasks: Task[]) => {
    storage.saveTasks(newTasks);
    setTasks(newTasks);
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const closeTaskDetails = () => {
    setIsTaskDrawerOpen(false);
    setSelectedTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks: saveTasks,
        updateTask,
        selectedTask,
        setSelectedTask,
        isTaskDrawerOpen,
        setIsTaskDrawerOpen,
        openTaskDetails,
        closeTaskDetails,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export type { Task, TaskComment };

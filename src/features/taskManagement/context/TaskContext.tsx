import React, { createContext, useContext, useState } from "react";
import { tasks as initialTasks } from "../mocks/kanbanData";

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
  progress: number;
  users: number;
  files: number;
  comments: number;
  title: string;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

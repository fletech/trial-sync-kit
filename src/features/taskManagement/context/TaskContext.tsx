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
  const [tasks, setTasks] = useState<Task[]>([]);

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
    }
  };

  const saveTasks = (newTasks: Task[]) => {
    storage.saveTasks(newTasks);
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks: saveTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

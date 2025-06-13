import React, { useState, useEffect } from "react";
import { X, Archive, Calendar, User, Flag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TaskPrioritySelector } from "./TaskPrioritySelector";
import { TaskAssigneeSelector } from "./TaskAssigneeSelector";
import { TaskComments } from "./TaskComments";
import { useTasks, Task } from "../../../contexts/TaskContext";
import { useToast } from "@/hooks/use-toast";
import storage from "@/services/storage";
import { notificationEvents } from "@/hooks/useNotifications";

interface TaskDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const { updateTask } = useTasks();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    owner: "Unassigned",
    startDate: "",
    endDate: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        owner: task.owner || "Unassigned",
        startDate: task.startDate || "",
        endDate: task.endDate || "",
      });
      setHasChanges(false);
    }
  }, [task]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!task) return;

    const updates: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      owner: formData.owner,
      startDate: formData.startDate,
      endDate: formData.endDate,
      // Update the dates string for display
      dates:
        formData.startDate && formData.endDate
          ? `${new Date(formData.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} - ${new Date(formData.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`
          : task.dates,
    };

    updateTask(task.id, updates);
    setHasChanges(false);

    // Create notification for task update
    storage.saveNotification({
      type: "task_update",
      title: "Task Updated",
      message: `Task "${formData.title}" has been updated`,
    });

    notificationEvents.emit();

    toast({
      title: "Task updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleArchive = () => {
    if (!task) return;

    updateTask(task.id, { archived: true });

    // Create notification for task archive
    storage.saveNotification({
      type: "task_update",
      title: "Task Archived",
      message: `Task "${task.title}" has been archived`,
    });

    notificationEvents.emit();

    toast({
      title: "Task archived",
      description: "The task has been moved to archive.",
    });

    onClose();
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmDiscard) return;
    }
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleCancel}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium">
              Task Title
            </Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title"
              className="text-lg font-medium"
            />
          </div>

          {/* Trial and Site Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Trial</Label>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 w-fit"
              >
                {task.trial}
              </Badge>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Site</Label>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 w-fit"
              >
                {task.site}
              </Badge>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="start-date"
                className="text-sm font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="end-date"
                className="text-sm font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Role</Label>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 w-fit"
            >
              {task.role}
            </Badge>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-1" />
              Assigned to
            </Label>
            <TaskAssigneeSelector
              value={formData.owner}
              onChange={(owner) => handleInputChange("owner", owner)}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Flag className="h-4 w-4 mr-1" />
              Priority
            </Label>
            <TaskPrioritySelector
              value={formData.priority}
              onChange={(priority) => handleInputChange("priority", priority)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add a description for this task..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Comments */}
          <div className="border-t pt-6">
            <TaskComments key={task.id} taskId={task.id} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleArchive}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive Task
          </Button>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-[#5B6CFF] hover:bg-[#4A5AE8]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

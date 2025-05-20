import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanTaskCardProps {
  task: any;
  isDraggingOverlay?: boolean;
}

export const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  isDraggingOverlay,
}) => {
  // Si es el overlay, no usamos useSortable
  const sortable = !isDraggingOverlay ? useSortable({ id: task.id }) : null;
  const style =
    !isDraggingOverlay && sortable
      ? {
          transform: CSS.Transform.toString(sortable.transform),
          transition: sortable.transition,
          zIndex: sortable.isDragging ? 50 : undefined,
          boxShadow: sortable.isDragging
            ? "0 8px 32px 0 rgba(80,80,120,0.25)"
            : undefined,
          opacity: sortable.isDragging ? 0.7 : 1,
        }
      : isDraggingOverlay
      ? {
          boxShadow: "0 12px 48px 0 rgba(80,80,120,0.35)",
          transform: "scale(1.05) rotate(-2deg)",
          zIndex: 100,
          opacity: 1,
          pointerEvents: "none",
        }
      : {};

  return (
    <div
      ref={sortable?.setNodeRef}
      {...(sortable ? sortable.attributes : {})}
      {...(sortable ? sortable.listeners : {})}
      style={style as React.CSSProperties}
      className={
        "bg-white border rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition-all select-none" +
        (sortable?.isDragging || isDraggingOverlay
          ? " ring-2 ring-primary/30"
          : "")
      }
    >
      {/* Aquí irá el contenido de la tarjeta de tarea */}
      <div className="font-semibold text-sm text-blue-700 mb-1">
        {task.trial}
      </div>
      <div className="text-xs text-gray-500 mb-2">{task.site}</div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            task.priority === "High"
              ? "bg-red-100 text-red-600"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {task.role}
        </span>
      </div>
      <div className="text-xs text-gray-700 mb-2">{task.owner}</div>
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
        <span>{task.dates}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>👥 {task.users}</span>
        <span>📄 {task.files}</span>
        <span>💬 {task.comments}</span>
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
        See Details
      </button>
    </div>
  );
};

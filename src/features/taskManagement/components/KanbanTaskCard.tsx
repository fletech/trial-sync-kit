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
  // No usar useSortable para el placeholder
  const isPlaceholder = task.isPlaceholder;
  const sortable =
    !isDraggingOverlay && !isPlaceholder ? useSortable({ id: task.id }) : null;
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

  if (isPlaceholder) return null;

  return (
    <div
      ref={sortable?.setNodeRef}
      {...(sortable ? sortable.attributes : {})}
      {...(sortable ? sortable.listeners : {})}
      style={style as React.CSSProperties}
      className={
        "bg-white border border-gray-200 rounded-lg shadow-sm p-3 cursor-pointer hover:shadow transition-all select-none" +
        (sortable?.isDragging || isDraggingOverlay
          ? " ring-2 ring-primary/30"
          : "")
      }
    >
      {/* Aquí irá el contenido de la tarjeta de tarea */}
      <div className="font-semibold text-xs text-blue-700 mb-0.5">
        {task.trial}
      </div>
      <div className="text-[11px] text-gray-500 mb-1">{task.site}</div>
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            task.priority === "High"
              ? "bg-red-100 text-red-600"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>
        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          {task.role}
        </span>
      </div>
      <div className="text-[11px] text-gray-700 mb-1">{task.owner}</div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-1">
        <span>{task.dates}</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400">
        <span>👥 {task.users}</span>
        <span>📄 {task.files}</span>
        <span>💬 {task.comments}</span>
      </div>
      <button
        className="mt-2 w-full border border-gray-200 rounded py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
        type="button"
      >
        See Details
      </button>
    </div>
  );
};

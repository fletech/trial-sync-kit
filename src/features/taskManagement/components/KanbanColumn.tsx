import React from "react";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  column: any;
  tasks: any[];
  isActive?: boolean;
  activeTaskId?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  isActive = false,
  activeTaskId,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow-sm p-4 min-h-[80vh] flex flex-col transition-all ${
        isOver ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="flex items-center mb-4 gap-2">
        <span
          className="uppercase font-bold text-xs px-3 py-1 rounded-full"
          style={{
            background: isActive ? "#2B59FF" : "#6C757D",
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          {column.name}
        </span>
        <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold border border-gray-200 ml-1">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) =>
          task.id === activeTaskId ? (
            <div
              key={task.id}
              className="h-[110px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg opacity-70"
            />
          ) : (
            <KanbanTaskCard key={task.id} task={task} />
          )
        )}
      </div>
    </div>
  );
};

import React from "react";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface KanbanColumnProps {
  column: any;
  tasks: any[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 min-h-[80vh] flex flex-col">
      <div className="flex items-center mb-4">
        <span
          className="font-semibold text-base mr-2"
          style={{ color: column.color }}
        >
          {column.name}
        </span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

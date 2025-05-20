import React, { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface KanbanBoardProps {
  columns: any[];
  tasks: any[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, tasks }) => {
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [columnTasks, setColumnTasks] = useState(tasks);

  // Encuentra la tarea activa por id
  const getActiveTask = (id: string) => columnTasks.find((t) => t.id === id);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const { active } = event;
        setActiveTask(getActiveTask(active.id as string));
      }}
      onDragEnd={(event) => {
        setActiveTask(null);
        // Aquí puedes implementar el movimiento real entre columnas si lo deseas
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex gap-6 overflow-x-auto w-full">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[340px]">
            <SortableContext
              items={columnTasks
                .filter((t) => t.columnId === column.id)
                .map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={columnTasks.filter((t) => t.columnId === column.id)}
              />
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <KanbanTaskCard task={activeTask} isDraggingOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

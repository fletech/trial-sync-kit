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

// Utilidad para agrupar tareas por columna
function groupTasksByColumn(tasks, columns) {
  const grouped = {};
  columns.forEach((col) => (grouped[col.id] = []));
  tasks.forEach((task) => {
    if (grouped[task.columnId]) grouped[task.columnId].push(task);
  });
  return grouped;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, tasks }) => {
  // Estado: tareas agrupadas por columna
  const [columnTasks, setColumnTasks] = useState(() =>
    groupTasksByColumn(tasks, columns)
  );
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Encuentra la tarea activa por id
  const getActiveTask = (id: string) => {
    for (const colId in columnTasks) {
      const found = columnTasks[colId].find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const { active } = event;
        setActiveTask(getActiveTask(active.id as string));
      }}
      onDragOver={(event) => {
        // Detecta sobre qué columna está el drag
        const { over } = event;
        if (over && columns.some((col) => col.id === over.id)) {
          setActiveColumnId(over.id as string);
        } else {
          setActiveColumnId(null);
        }
      }}
      onDragEnd={(event) => {
        setActiveTask(null);
        setActiveColumnId(null);
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id as string;
        const overId = over.id as string;

        // Buscar columna y posición de la card activa
        let sourceColId = null;
        let activeTaskIndex = -1;
        for (const colId in columnTasks) {
          const idx = columnTasks[colId].findIndex((t) => t.id === activeId);
          if (idx !== -1) {
            sourceColId = colId;
            activeTaskIndex = idx;
            break;
          }
        }
        if (!sourceColId) return;

        // Si el drop es sobre una columna vacía o al final de la columna
        if (columns.some((col) => col.id === overId)) {
          if (sourceColId === overId) return;
          const taskToMove = columnTasks[sourceColId][activeTaskIndex];
          setColumnTasks((prev) => {
            const newSource = prev[sourceColId].filter(
              (t) => t.id !== activeId
            );
            const newDest = [
              ...prev[overId],
              { ...taskToMove, columnId: overId },
            ];
            return { ...prev, [sourceColId]: newSource, [overId]: newDest };
          });
          return;
        }

        // Si el drop es sobre otra card (en cualquier columna)
        let destColId = null;
        let overTaskIndex = -1;
        for (const colId in columnTasks) {
          const idx = columnTasks[colId].findIndex((t) => t.id === overId);
          if (idx !== -1) {
            destColId = colId;
            overTaskIndex = idx;
            break;
          }
        }
        if (!destColId) return;

        // Si es la misma columna, reordenar
        if (sourceColId === destColId) {
          if (activeTaskIndex === overTaskIndex) return;
          setColumnTasks((prev) => {
            const newTasks = arrayMove(
              prev[sourceColId],
              activeTaskIndex,
              overTaskIndex
            );
            return { ...prev, [sourceColId]: newTasks };
          });
        } else {
          // Si es otra columna, insertar en la posición correcta
          const taskToMove = columnTasks[sourceColId][activeTaskIndex];
          setColumnTasks((prev) => {
            const newSource = prev[sourceColId].filter(
              (t) => t.id !== activeId
            );
            const newDest = [
              ...prev[destColId].slice(0, overTaskIndex),
              { ...taskToMove, columnId: destColId },
              ...prev[destColId].slice(overTaskIndex),
            ];
            return { ...prev, [sourceColId]: newSource, [destColId]: newDest };
          });
        }
      }}
      onDragCancel={() => {
        setActiveTask(null);
        setActiveColumnId(null);
      }}
    >
      <div className="flex gap-6 overflow-x-auto w-full">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[340px]">
            <SortableContext
              items={columnTasks[column.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={columnTasks[column.id]}
                isActive={activeColumnId === column.id}
                activeTaskId={
                  activeTask?.columnId === column.id ? activeTask.id : undefined
                }
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

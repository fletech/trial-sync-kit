import React, { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTasks } from "../../../contexts/TaskContext";

interface KanbanBoardProps {
  columns: any[];
  filteredTasks?: any[];
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

export const KanbanBoard = ({ columns, filteredTasks }: KanbanBoardProps) => {
  const { tasks, setTasks } = useTasks();

  // Use filtered tasks if provided, otherwise use all tasks
  const tasksToUse = filteredTasks || tasks;

  const [columnTasks, setColumnTasks] = useState(() =>
    groupTasksByColumn(tasksToUse, columns)
  );
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [overColId, setOverColId] = useState<string | null>(null);

  // Update columnTasks when tasks change
  React.useEffect(() => {
    setColumnTasks(groupTasksByColumn(tasksToUse, columns));
  }, [tasksToUse, columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Solo activa drag si el mouse se mueve al menos 8px
      },
    })
  );

  // Encuentra la tarea activa por id
  const getActiveTask = (id: string) => {
    for (const colId in columnTasks) {
      const found = columnTasks[colId].find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  };

  // Virtualización: solo filtra la card original y muestra el placeholder si hay drag activo
  const getVirtualColumnTasks = () => {
    console.log(
      "[getVirtualColumnTasks] draggingTaskId:",
      draggingTaskId,
      "overColId:",
      overColId
    );
    if (!draggingTaskId || !overColId) {
      console.log(
        "[getVirtualColumnTasks] No drag activo, devuelvo columnTasks",
        columnTasks
      );
      return columnTasks;
    }
    const tasksByCol = {};
    for (const col of columns) {
      let arr = columnTasks[col.id].filter((t) => t.id !== draggingTaskId);
      if (col.id === overColId) {
        const task = getActiveTask(draggingTaskId);
        if (task) {
          arr = [
            ...arr,
            { ...task, id: "__placeholder__", isPlaceholder: true },
          ];
        }
      }
      tasksByCol[col.id] = arr;
    }
    console.log("[getVirtualColumnTasks] tasksByCol:", tasksByCol);
    return tasksByCol;
  };

  const virtualColumnTasks = getVirtualColumnTasks();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        console.log("[onDragStart]", event);
        setDraggingTaskId(event.active.id as string);
      }}
      onDragOver={(event) => {
        const { over } = event;
        console.log("[onDragOver] over:", over);
        if (over) {
          // ¿Es una columna?
          const col = columns.find((c) => c.id === over.id);
          if (col) {
            setOverColId(col.id);
            console.log("[onDragOver] setOverColId:", col.id);
          } else {
            // ¿Es una card?
            for (const colId in columnTasks) {
              if (columnTasks[colId].some((t) => t.id === over.id)) {
                setOverColId(colId);
                console.log("[onDragOver] setOverColId (card):", colId);
                break;
              }
            }
          }
        } else {
          setOverColId(null);
          console.log("[onDragOver] setOverColId: null");
        }
      }}
      onDragEnd={(event) => {
        console.log("[onDragEnd]", event);
        const { active, over } = event;
        setDraggingTaskId(null);
        setOverColId(null);
        if (!over) return;
        const activeId = active.id as string;
        let destColId = null;
        let destIdx = null;
        // Si el mouse está sobre una columna, va al final
        const col = columns.find((c) => c.id === over.id);
        if (col) {
          destColId = col.id;
          destIdx = columnTasks[destColId].length - 1;
        } else {
          // Si está sobre una card, busco la columna y el índice de esa card
          for (const colId in columnTasks) {
            const idx = columnTasks[colId].findIndex((t) => t.id === over.id);
            if (idx !== -1) {
              destColId = colId;
              destIdx = idx;
              break;
            }
          }
        }
        if (!destColId) return;
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

        // NO HACER NADA si no cambió de lugar
        if (
          sourceColId === destColId &&
          (activeTaskIndex === destIdx || destIdx === -1)
        ) {
          return;
        }

        const taskToMove = columnTasks[sourceColId][activeTaskIndex];

        // Update tasks and persist to localStorage
        let updatedTasks = [...tasks];

        if (sourceColId === destColId) {
          // REORDENAR dentro de la misma columna - no need to update tasks array order for now
          // Just update the local state for visual feedback
          setColumnTasks((prev) => {
            const oldTasks = prev[sourceColId];
            const newTasks = arrayMove(oldTasks, activeTaskIndex, destIdx);
            return { ...prev, [sourceColId]: newTasks };
          });
        } else {
          // MOVER entre columnas - update the task's columnId
          updatedTasks = tasks.map((task) =>
            task.id === activeId ? { ...task, columnId: destColId } : task
          );

          // Save to localStorage
          setTasks(updatedTasks);

          // Update local state
          setColumnTasks((prev) => {
            const newSource = prev[sourceColId].filter(
              (t) => t.id !== activeId
            );
            const newDest = [
              ...prev[destColId],
              { ...taskToMove, columnId: destColId },
            ];
            return { ...prev, [sourceColId]: newSource, [destColId]: newDest };
          });
        }
      }}
      onDragCancel={() => {
        console.log("[onDragCancel]");
        setDraggingTaskId(null);
        setOverColId(null);
      }}
    >
      <div className="flex gap-6 overflow-x-auto w-full">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[340px]">
            <SortableContext
              items={virtualColumnTasks[column.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={virtualColumnTasks[column.id]}
              />
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {draggingTaskId ? (
          <KanbanTaskCard
            task={getActiveTask(draggingTaskId)}
            isDraggingOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

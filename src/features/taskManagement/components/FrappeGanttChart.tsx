import React, { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/TaskContext";
import "../styles/frappe-gantt-custom.css";

// Declaramos Gantt como una variable global
declare const Gantt: any;

// Interfaces para TypeScript
interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies?: string[];
  parentId?: string | null;
}

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies: string[];
  custom_class: string;
}

// Función para procesar tareas
const processTasks = (tasks: Task[]): GanttTask[] => {
  if (!tasks || tasks.length === 0) return [];

  return tasks.map((task) => ({
    id: task.id,
    name: task.title,
    start: task.startDate,
    end: task.endDate,
    progress: task.progress || 0,
    dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
    custom_class: task.parentId ? "child-task" : "parent-task",
  }));
};

const FrappeGanttChart = ({
  filteredTasks,
}: { filteredTasks?: any[] } = {}) => {
  const { tasks } = useTasks();

  // Use filtered tasks if provided, otherwise use all tasks
  const tasksToUse = filteredTasks || tasks;

  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ganttInstance, setGanttInstance] = useState<any>(null);
  const [viewMode, setViewMode] = useState("Week");

  // Manejar cambios de vista
  const changeViewMode = (mode: string) => {
    if (!ganttInstance) return;
    ganttInstance.change_view_mode(mode);
    setViewMode(mode);
  };

  useEffect(() => {
    // Usar setTimeout para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      if (!ganttContainerRef.current) {
        setError("Contenedor no encontrado");
        setLoading(false);
        return;
      }

      try {
        // Verificar que Gantt esté definido globalmente
        if (typeof Gantt === "undefined") {
          throw new Error("Frappe Gantt no está cargado correctamente");
        }

        // Procesar las tareas reales
        let ganttTasks = processTasks(tasksToUse);

        // Usar datos de ejemplo solo si no hay tareas reales
        if (ganttTasks.length === 0) {
          ganttTasks = [
            {
              id: "task1",
              name: "Tarea de ejemplo 1",
              start: "2024-12-01",
              end: "2024-12-31",
              progress: 0.6,
              dependencies: [],
              custom_class: "parent-task",
            },
            {
              id: "task2",
              name: "Tarea de ejemplo 2",
              start: "2024-12-05",
              end: "2024-12-15",
              progress: 0.4,
              dependencies: ["task1"],
              custom_class: "child-task",
            },
          ];
        }

        console.log("Inicializando Gantt con:", ganttTasks);

        // Inicializar con opciones mejoradas
        const gantt = new Gantt("#gantt-chart", ganttTasks, {
          view_mode: viewMode,
          date_format: "YYYY-MM-DD",
          bar_height: 30,
          bar_corner_radius: 3,
          arrow_curve: 5,
          padding: 18,
          view_modes: ["Day", "Week", "Month"],
          // Personalizar colores (estos se aplicarán mediante CSS)
          custom_popup_html: (task: any) => {
            return `
              <div class="themison-gantt-popup">
                <h4>${task.name}</h4>
                <div class="dates">
                  ${new Date(task.start).toLocaleDateString()} - 
                  ${new Date(task.end).toLocaleDateString()}
                </div>
                <div class="progress-wrapper">
                  <div class="progress-label">Progreso: ${Math.round(
                    task.progress * 100
                  )}%</div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${
                      task.progress * 100
                    }%"></div>
                  </div>
                </div>
              </div>
            `;
          },
        });

        // Guardar la instancia para poder cambiar la vista después
        setGanttInstance(gantt);
        console.log("Gantt inicializado:", gantt);
        setLoading(false);
      } catch (error: any) {
        console.error("Error al renderizar el gráfico Gantt:", error);
        setError(error.message || "Error al renderizar el gráfico");
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [tasksToUse]);

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium">Gantt Chart</h2>

        {/* Botones de vista */}
        <div className="flex gap-2">
          <button className="px-4 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100">
            PI view
          </button>
          <button className="px-4 py-1.5 text-sm rounded-md bg-[#2B59FF] bg-opacity-10 text-[#2B59FF] font-medium">
            CRC view
          </button>
          <button className="px-4 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100">
            Physician view
          </button>
        </div>

        {/* Botones para cambiar modo de vista */}
        <div className="flex space-x-2">
          <button
            className={`p-1.5 rounded-md ${
              viewMode === "Day"
                ? "bg-[#2B59FF] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => changeViewMode("Day")}
          >
            Day
          </button>
          <button
            className={`p-1.5 rounded-md ${
              viewMode === "Week"
                ? "bg-[#2B59FF] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => changeViewMode("Week")}
          >
            Week
          </button>
          <button
            className={`p-1.5 rounded-md ${
              viewMode === "Month"
                ? "bg-[#2B59FF] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => changeViewMode("Month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: "calc(100vh - 200px)" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div>Cargando gráfico Gantt...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-red-500 p-4 text-center">
              <p>Error al cargar el gráfico Gantt:</p>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <div
          ref={ganttContainerRef}
          id="gantt-chart"
          style={{ height: "100%", width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default FrappeGanttChart;

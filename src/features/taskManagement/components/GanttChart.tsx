import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTasks } from "../context/TaskContext";

// Utilidades para fechas y jerarquía
function getDateRange(tasks) {
  let min = null,
    max = null;
  tasks.forEach((t) => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    if (!min || start < min) min = start;
    if (!max || end > max) max = end;
  });

  // Si no se encontraron fechas, mostrar el mes actual
  if (!min || !max) {
    const now = new Date();
    return {
      min: new Date(now.getFullYear(), now.getMonth(), 1),
      max: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    };
  }

  return { min, max };
}

function buildTree(tasks, parentId = null, prefix = "", level = 0) {
  const children = tasks
    .filter((t) => t.parentId === parentId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return children.map((t, idx) => {
    const number = prefix ? `${prefix}.${idx + 1}` : `${idx + 1}`;
    return {
      ...t,
      number,
      level,
      children: buildTree(tasks, t.id, number, level + 1),
    };
  });
}

function groupDays(days) {
  const months = [];
  let currentMonth = null;
  let currentWeek = null;
  days.forEach((date, idx) => {
    const month = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const week = getWeekNumber(date);
    if (!currentMonth || currentMonth.name !== month) {
      currentMonth = { name: month, start: idx, days: 0 };
      months.push(currentMonth);
    }
    currentMonth.days++;
    if (!currentWeek || currentWeek.number !== week) {
      currentWeek = { number: week, start: idx, days: 0 };
      if (!currentMonth.weeks) currentMonth.weeks = [];
      currentMonth.weeks.push(currentWeek);
    }
    currentWeek.days++;
  });
  months.forEach((m) => {
    m.days = Number(m.days);
    if (m.weeks) m.weeks.forEach((w) => (w.days = Number(w.days)));
  });
  return months;
}

function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
}

// Constantes
const ROW_HEIGHT = 40;
const LEFT_PANEL_WIDTH = 320;
const DAY_WIDTH = 48; // Aumentado para dar más espaciado como en el diseño original

// Función para formatear fechas
const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Función para formatear rango de fechas para semanas
const formatWeekRange = (firstDay, daysInWeek) => {
  if (!firstDay || daysInWeek < 1) return "";

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + daysInWeek - 1);

  return `${firstDay.getDate()} - ${lastDay.getDate()} ${firstDay.toLocaleString(
    "default",
    { month: "short" }
  )}`;
};

const GanttChart = () => {
  const { tasks } = useTasks();
  const { min, max } = useMemo(() => getDateRange(tasks), [tasks]);
  const tree = useMemo(() => buildTree(tasks), [tasks]);
  const [expanded, setExpanded] = useState({});
  const scrollRef = useRef(null);
  const headerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: min, end: max });

  // Generar días entre min y max
  const days = [];
  let d = new Date(visibleRange.start);
  while (d <= visibleRange.end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  const months = useMemo(() => groupDays(days), [days]);

  // Inicialización de vista: asegurar que se vean todas las tareas en pantalla
  useEffect(() => {
    setVisibleRange({ start: min, end: max });
  }, [min, max]);

  // Expand/collapse handler
  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // Sincronizar scroll horizontal entre header y body
  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current && scrollRef.current) {
        headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
      }
    };
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", onScroll);
    return () => el && el.removeEventListener("scroll", onScroll);
  }, []);

  // Renderizar árbol jerárquico (panel izquierdo)
  const renderTree = (nodes) =>
    nodes.map((task) => {
      const hasChildren = task.children && task.children.length > 0;
      const isOpen = expanded[task.id] ?? true;

      return (
        <React.Fragment key={task.id}>
          <div
            className={`flex items-center h-10 border-b border-gray-100 text-sm select-none group relative ${
              task.level === 0
                ? "bg-gray-50 font-medium text-themison-text"
                : "bg-white font-normal text-themison-text"
            }`}
            style={{ paddingLeft: `${task.level * 1.5 + 1}rem` }}
          >
            {hasChildren ? (
              <button
                onClick={() => toggle(task.id)}
                className="mr-2 text-gray-500 focus:outline-none"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "transform rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <span className="mr-2 w-4"></span>
            )}
            <span className="text-xs text-gray-500 w-5 mr-1">
              {task.number}
            </span>
            <span className="truncate max-w-xs" title={task.title}>
              {task.title}
            </span>

            {/* Menú de acciones (tres puntos) a la derecha */}
            {task.level === 0 && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            )}
          </div>
          {hasChildren && isOpen && renderTree(task.children)}
        </React.Fragment>
      );
    });

  // Renderizar filas de barras (panel derecho)
  const minTs = min.getTime();
  const renderBarRows = (nodes) =>
    nodes.flatMap((task) => {
      const startIdx = Math.floor(
        (new Date(task.startDate).getTime() - minTs) / (1000 * 60 * 60 * 24)
      );
      const endIdx = Math.floor(
        (new Date(task.endDate).getTime() - minTs) / (1000 * 60 * 60 * 24)
      );
      const left = startIdx * DAY_WIDTH;
      const width = Math.max((endIdx - startIdx + 1) * DAY_WIDTH, 20); // Mínimo 20px para visualización

      // Determinar estilo basado en nivel
      const getBarStyles = () => {
        if (task.level === 0) {
          return {
            bgColor: "#2B59FF", // Color primario de Themison
            height: "h-6",
            top: "top-2",
            textSize: "text-xs",
            textColor: "text-white",
            border: "",
            rounded: "rounded",
          };
        } else if (task.level === 1) {
          return {
            bgColor: "#5680FF", // Versión más clara pero coherente con el primario
            height: "h-5",
            top: "top-2.5",
            textSize: "text-xs",
            textColor: "text-white",
            border: "",
            rounded: "rounded-sm",
          };
        } else {
          return {
            bgColor: "#DFE7FF", // Versión muy clara/pastel pero coherente
            height: "h-4",
            top: "top-3",
            textSize: "text-xs",
            textColor: "text-themison-text",
            border: "border border-[#2B59FF]",
            rounded: "rounded-sm",
          };
        }
      };

      const styles = getBarStyles();
      const hasChildren = task.children && task.children.length > 0;
      const isOpen = expanded[task.id] ?? true;

      // Barra de progreso
      const progressWidth =
        task.progress > 0 ? `${task.progress * 100}%` : "0%";

      const result = [
        <div key={task.id} className="h-10 border-b border-gray-100 relative">
          {/* Barra principal */}
          <div
            className={`absolute ${styles.height} ${styles.top} ${styles.rounded} flex items-center overflow-hidden shadow-sm transition-all`}
            style={{
              left: `${left}px`,
              width: `${width}px`,
              backgroundColor: styles.bgColor,
              zIndex: 10 - task.level,
            }}
            title={`${task.title}: ${formatShortDate(
              task.startDate
            )} - ${formatShortDate(task.endDate)}`}
          >
            {/* Barra de progreso si tiene progreso */}
            {task.progress > 0 && (
              <div
                className="absolute h-full top-0 left-0 bg-[#00C07C] bg-opacity-30"
                style={{ width: progressWidth }}
              />
            )}

            {/* Texto si la barra es suficientemente ancha */}
            {width > 50 && (
              <span
                className={`${styles.textSize} ${styles.textColor} truncate ml-2 z-10`}
              >
                {task.title}
              </span>
            )}
          </div>

          {/* Fecha al lado de la barra (para tareas principales) */}
          {task.level === 0 && (
            <span
              className="absolute text-xs text-gray-500 whitespace-nowrap"
              style={{
                left: left + width + 6,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {task.dates}
            </span>
          )}
        </div>,
      ];

      return result;
    });

  // Calcular posición de la línea de hoy
  const today = new Date();
  const todayIdx = days.findIndex(
    (d) => d.toDateString() === today.toDateString()
  );

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header con botones de vista */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-themison-text">Gantt Chart</h2>
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
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Header de la tabla (fechas) */}
      <div
        ref={headerRef}
        className="overflow-x-auto sticky top-0 z-30 bg-white shadow-sm"
      >
        {/* Meses */}
        <div className="flex">
          <div className="w-80 min-w-[20rem] font-medium text-themison-text px-4 py-2.5 border-r border-gray-200 bg-gray-50">
            Title
          </div>
          {months.map((month, i) => (
            <div
              key={i}
              className="text-sm font-medium text-themison-text border-r border-gray-200 bg-gray-50 flex items-center justify-center"
              style={{
                width: `${month.days * DAY_WIDTH}px`,
                minWidth: `${month.days * DAY_WIDTH}px`,
                height: "40px",
              }}
            >
              {month.name}
            </div>
          ))}
        </div>

        {/* Semanas */}
        <div className="flex">
          <div
            className="w-80 min-w-[20rem] border-r border-gray-200 bg-gray-50"
            style={{ height: "32px" }}
          />
          {months.map((month, i) =>
            month.weeks.map((week, j) => {
              const firstDayOfWeek = new Date(days[month.start + week.start]);
              const isCurrentWeek = week.number === getWeekNumber(today);

              return (
                <div
                  key={`${i}-w-${j}`}
                  className={`text-xs py-1 border-r border-gray-200 flex items-center justify-center ${
                    isCurrentWeek
                      ? "bg-[#2B59FF] bg-opacity-5 text-[#2B59FF] font-medium"
                      : "bg-gray-50 text-gray-600"
                  }`}
                  style={{
                    width: `${week.days * DAY_WIDTH}px`,
                    minWidth: `${week.days * DAY_WIDTH}px`,
                    height: "32px",
                  }}
                >
                  Week {week.number}
                  {isCurrentWeek && week.days >= 4 && (
                    <span className="ml-1">
                      {formatWeekRange(firstDayOfWeek, week.days)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Días */}
        <div className="flex">
          <div
            className="w-80 min-w-[20rem] border-r border-gray-200 bg-gray-50"
            style={{ height: "36px" }}
          />
          {days.map((d, i) => {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const isToday = d.toDateString() === today.toDateString();

            return (
              <div
                key={i}
                className={`min-w-[${DAY_WIDTH}px] text-xs text-center py-1 border-r border-gray-100 ${
                  isWeekend
                    ? "bg-gray-100 text-gray-500"
                    : isToday
                    ? "bg-[#2B59FF] bg-opacity-5 font-medium text-[#2B59FF]"
                    : "bg-white text-gray-600"
                }`}
                style={{
                  width: `${DAY_WIDTH}px`,
                  height: "36px",
                }}
              >
                {d.getDate()}
                <div className="text-[9px] text-gray-500 mt-0.5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cuerpo de la tabla */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ overscrollBehavior: "auto" }}
      >
        {/* Panel izquierdo: árbol jerárquico */}
        <div className="w-80 min-w-[20rem] flex flex-col border-r border-gray-200 bg-white sticky left-0 z-10">
          {renderTree(tree)}
        </div>

        {/* Panel derecho: barras de Gantt */}
        <div
          className="flex-1 flex flex-col relative"
          style={{ minWidth: `${days.length * DAY_WIDTH}px` }}
        >
          {/* Líneas verticales para días */}
          {days.map((d, i) => (
            <div
              key={`grid-${i}`}
              className={`absolute top-0 bottom-0 border-r ${
                d.getDay() === 0 || d.getDay() === 6
                  ? "border-gray-200"
                  : "border-gray-100"
              }`}
              style={{ left: i * DAY_WIDTH, width: 1, height: "100%" }}
            />
          ))}

          {/* Línea vertical de "hoy" */}
          {todayIdx !== -1 && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#2B59FF] z-20"
              style={{ left: todayIdx * DAY_WIDTH, height: "100%" }}
            />
          )}

          {/* Barras de tareas */}
          {renderBarRows(tree)}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

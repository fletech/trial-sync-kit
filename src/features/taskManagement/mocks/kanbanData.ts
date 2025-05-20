// Columnas del Kanban
export const columns = [
  { id: "planning", name: "Planning", color: "#2563eb" },
  { id: "regulatory", name: "Regulatory Prep", color: "#6366f1" },
  { id: "site-initiation", name: "Site Initiation", color: "#0ea5e9" },
  { id: "recruiting", name: "Recruiting", color: "#22c55e" },
  { id: "study", name: "Study Conduct", color: "#f59e42" },
];

// Tareas del Kanban (ejemplo)
export const tasks = [
  {
    id: "1",
    columnId: "planning",
    trial: "CARDIOMEGA Trial",
    site: "Humanitas Milano",
    priority: "High",
    role: "CRA",
    owner: "Dr. Dulce Donin",
    dates: "Sep 26 – Oct 25",
    users: 5,
    files: 3,
    comments: 3,
    title: "Prepare CVs",
  },
  // ...agregar más tareas siguiendo la imagen...
];

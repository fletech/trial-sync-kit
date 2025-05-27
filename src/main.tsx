import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { mountStagewiseToolbar } from "./stagewise-toolbar.tsx";

createRoot(document.getElementById("root")!).render(<App />);

if (process.env.NODE_ENV === "development") {
  mountStagewiseToolbar();
}

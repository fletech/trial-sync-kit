import React from "react";
import { createRoot } from "react-dom/client";
import { StagewiseToolbar } from "@stagewise/toolbar-react";

const stagewiseConfig = { plugins: [] };

export function mountStagewiseToolbar() {
  if (process.env.NODE_ENV === "development") {
    let toolbarRoot = document.getElementById("stagewise-toolbar-root");
    if (!toolbarRoot) {
      toolbarRoot = document.createElement("div");
      toolbarRoot.id = "stagewise-toolbar-root";
      document.body.appendChild(toolbarRoot);
    }
    createRoot(toolbarRoot).render(
      <StagewiseToolbar config={stagewiseConfig} />
    );
  }
}

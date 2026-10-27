"use client";

import React from "react";
import { Sparkles, LayoutDashboard } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function DualNavigationNav() {
  const { navMode, setNavMode, currentStep } = useProject();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border bg-card/40 px-6 py-3 backdrop-blur-xs">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Modo de Trabajo:
        </span>
        <div
          role="tablist"
          aria-label="Selector de Modo de Navegación"
          className="inline-flex rounded-xl bg-muted p-1 border border-border"
        >
          <button
            role="tab"
            aria-selected={navMode === "wizard"}
            onClick={() => setNavMode("wizard")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              navMode === "wizard"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Asistente Guiado (Paso a Paso)</span>
            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Paso {currentStep}/7
            </span>
          </button>

          <button
            role="tab"
            aria-selected={navMode === "dashboard"}
            onClick={() => setNavMode("dashboard")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              navMode === "dashboard"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Dashboard Libre (Modular)</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span>Motor Financiero: <strong>0 ms de latencia (reactivo)</strong></span>
      </div>
    </div>
  );
}

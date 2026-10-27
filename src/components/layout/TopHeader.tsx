"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Sparkles,
  Accessibility,
  Bell,
  LayoutGrid,
  Check,
} from "lucide-react";
import { useA11y } from "@/context/A11yContext";
import { useProject } from "@/context/ProjectContext";

export function TopHeader() {
  const { toggleHub } = useA11y();
  const { projectInfo } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const handleOpenCopilot = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-copilot", { detail: { action: "audit" } }));
    }
  };

  return (
    <header
      className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors shadow-[0_1px_8px_rgba(15,23,42,0.02)]"
      role="banner"
    >
      {/* Sección Izquierda: Buscador Global & Selector de Proyecto */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Barra de Búsqueda Global */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar rubro, indicador, cuenta o competidor..."
            className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Selector de Proyecto */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer transition-all"
          >
            <span className="text-slate-400 dark:text-slate-500 font-normal">Proyecto |</span>
            <span className="truncate max-w-[160px] font-bold text-slate-900 dark:text-white">
              {projectInfo.name || "Agencia Popayán S.A.S."}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Proyectos Activos
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-100 text-xs font-semibold">
                <span className="truncate">{projectInfo.name}</span>
                <Check className="h-4 w-4 text-violet-600 shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sección Derecha: Acciones Rápidas (Copilot, A11y, Notificaciones, Apps) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Botón Píldora Copilot IA */}
        <button
          type="button"
          onClick={handleOpenCopilot}
          className="flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/60 dark:to-indigo-950/60 px-3.5 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-150"
          title="Abrir Asistente Copilot IA"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 animate-pulse" />
          <span>Copilot IA</span>
        </button>

        {/* Botón Accesibilidad */}
        <button
          type="button"
          onClick={toggleHub}
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-xs"
          title="Abrir Centro de Accesibilidad (Alt + A)"
        >
          <Accessibility className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden lg:inline">Accesibilidad (Alt+A)</span>
        </button>

        {/* Botón Notificaciones */}
        <button
          type="button"
          aria-label="Notificaciones del sistema"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Botón Apps Grid */}
        <button
          type="button"
          aria-label="Aplicaciones del ecosistema"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <LayoutGrid className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}

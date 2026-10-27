"use client";

import React from "react";
import { Calculator, Accessibility } from "lucide-react";
import { useA11y } from "@/context/A11yContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "Matriz de Negocios",
  subtitle = "Evaluación Financiera & Factibilidad Multicriterio (Metodología Jorge Orozco)",
}: HeaderProps) {
  const { toggleHub } = useA11y();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md px-6 py-3.5 shadow-xs sticky top-0 z-30" role="banner">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Título */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground leading-tight">
                {title}
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                Benchmark Jorge Orozco
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Acciones del Header */}
        <div className="flex items-center gap-2">
          {/* Botón rápido de accesibilidad en cabecera */}
          <button
            type="button"
            onClick={toggleHub}
            aria-label="Abrir panel de accesibilidad (Alt + A)"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <Accessibility className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="hidden md:inline">Accesibilidad (Alt+A)</span>
          </button>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Next.js 15</span>
          </span>
        </div>
      </div>
    </header>
  );
}

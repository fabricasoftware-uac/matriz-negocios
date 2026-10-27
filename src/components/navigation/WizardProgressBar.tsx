"use client";

import React from "react";
import {
  FileText,
  DollarSign,
  Briefcase,
  Users,
  Layers,
  Leaf,
  Award,
  Check,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export const WIZARD_STEPS = [
  { id: 1, title: "Identidad", subtitle: "Ficha Técnica", icon: FileText },
  { id: 2, title: "Mercado & Precios", subtitle: "Ingresos Proyectados", icon: DollarSign },
  { id: 3, title: "Inversión CAPEX", subtitle: "Activos & Depreciación", icon: Briefcase },
  { id: 4, title: "Nómina & Costos", subtitle: "Personal & OPEX", icon: Users },
  { id: 5, title: "Capital de Trabajo", subtitle: "Días de KTNO", icon: Layers },
  { id: 6, title: "Riesgos & Conesa", subtitle: "Matriz Ambiental", icon: Leaf },
  { id: 7, title: "Viabilidad & KPIs", subtitle: "TIR, VPN y Flujos", icon: Award },
];

export function WizardProgressBar() {
  const { currentStep, setCurrentStep } = useProject();
  const progressPercent = Math.round(((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100);

  return (
    <div className="w-full bg-card border-b border-border py-4 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado y porcentaje */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Asistente de Formulación
            </span>
            <h2 className="text-sm font-bold text-foreground">
              Paso {currentStep} de 7: {WIZARD_STEPS[currentStep - 1]?.title}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-foreground">{progressPercent}%</span>
            <span className="text-xs text-muted-foreground ml-1">completado</span>
          </div>
        </div>

        {/* Barra de progreso continua */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del asistente de proyecto"
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pasos individuales navegables */}
        <nav aria-label="Pasos del asistente" className="mt-4">
          <ol className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {WIZARD_STEPS.map((step) => {
              const isCurrent = step.id === currentStep;
              const isPast = step.id < currentStep;
              const Icon = step.icon;

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`w-full flex items-center gap-2 rounded-xl p-2.5 text-left transition-all cursor-pointer border ${
                      isCurrent
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-100 ring-2 ring-blue-500/20"
                        : isPast
                        ? "border-emerald-200 bg-emerald-50/50 text-foreground dark:border-emerald-900/50 dark:bg-emerald-950/20"
                        : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : isPast
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isPast ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {step.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                        {step.subtitle}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

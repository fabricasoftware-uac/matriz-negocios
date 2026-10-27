"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function StepIdentity() {
  const { projectInfo, setProjectInfo, discountRate, setDiscountRate } = useProject();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Paso 1 de 7 • Ficha Técnica y Supuestos
        </span>
        <h3 className="text-xl font-bold text-foreground mt-0.5">
          Identidad del Proyecto & Tasa de Descuento (WACC)
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          Define el alcance del proyecto y la tasa de rentabilidad mínima exigida (costo de oportunidad del inversionista).
        </p>
      </div>

      {/* Micro-guía explicativa */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">¿Qué es la Tasa de Descuento (WACC) y por qué es clave?</span>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/90">
              Es el rendimiento mínimo que exigen los accionistas y financiadores (por ejemplo, 10% anual). Si la Tasa Interna de Retorno (TIR) de tu proyecto es mayor al WACC, el proyecto crea valor y es viable. Si es menor, destruye capital.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de Identidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div>
            <label htmlFor="proj-name" className="block text-xs font-semibold text-foreground mb-1">
              Nombre Oficial del Proyecto
            </label>
            <input
              id="proj-name"
              type="text"
              value={projectInfo.name}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-semibold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="proj-desc" className="block text-xs font-semibold text-foreground mb-1">
              Descripción Ejecutiva / Propósito
            </label>
            <textarea
              id="proj-desc"
              rows={3}
              value={projectInfo.description}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="proj-sector" className="block text-xs font-semibold text-foreground mb-1">
                Sector Económico
              </label>
              <input
                id="proj-sector"
                type="text"
                value={projectInfo.sector}
                onChange={(e) => setProjectInfo((prev) => ({ ...prev, sector: e.target.value }))}
                className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="proj-curr" className="block text-xs font-semibold text-foreground mb-1">
                Moneda Base
              </label>
              <input
                id="proj-curr"
                type="text"
                disabled
                value={projectInfo.currency}
                className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs font-mono text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Tasa de Descuento (WACC Slider) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Tasa de Descuento / Costo de Capital (WACC)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Benchmark Jorge Orozco: 10.0%
                </span>
              </div>
              <span className="rounded-xl bg-blue-100 px-3 py-1.5 text-base font-bold font-mono text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                {(discountRate * 100).toFixed(1)}%
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <input
                type="range"
                min={0.05}
                max={0.3}
                step={0.005}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
                aria-label="Slider de tasa de descuento"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>5.0% (Conservador)</span>
                <span>10.0% (Benchmark)</span>
                <span>30.0% (Alto Riesgo)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground block mb-0.5">
              Sensibilidad Inmediata:
            </span>
            Una tasa mayor exigirá flujos de caja más altos para que el VPN resulte positivo. Con el benchmark actual (10%), el VPN generado es superior a los $81 millones COP.
          </div>
        </div>
      </div>
    </div>
  );
}

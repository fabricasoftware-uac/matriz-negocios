"use client";

import React from "react";
import { ResultsKPIs } from "@/components/dashboard/ResultsKPIs";
import { FinancialTables } from "@/components/dashboard/FinancialTables";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { IncomeEvolutionChart } from "@/components/charts/IncomeEvolutionChart";
import { ExportReportModal } from "@/components/dashboard/ExportReportModal";

export function StepResults() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Paso 7 de 7 • Dictamen de Viabilidad
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Conclusiones Financieras & Estados Proyectados
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Evaluación integral del Flujo de Caja Libre descontado. Compara la TIR del proyecto con la tasa de descuento mínima esperada (WACC) y analiza los gráficos de rentabilidad.
          </p>
        </div>

        <div className="shrink-0">
          <ExportReportModal />
        </div>
      </div>

      <ResultsKPIs />

      {/* Gráficos Recharts Interactivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart height={340} />
        <IncomeEvolutionChart height={340} />
      </div>

      <FinancialTables />
    </div>
  );
}

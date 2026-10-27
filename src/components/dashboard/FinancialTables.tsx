"use client";

import React, { useState } from "react";
import { Table, FileSpreadsheet, Layers, DollarSign } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function FinancialTables() {
  const { engineOutput } = useProject();
  const { incomeStatement, workingCapital, cashFlow } = engineOutput;
  const [activeSubTab, setActiveSubTab] = useState<"fcl" | "pyg" | "ktno">("fcl");

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const years = [0, 1, 2, 3, 4, 5];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      {/* Subtabs de navegación de tablas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Estados Financieros Proyectados (Años 0 al 5)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modelados de acuerdo con la metodología cuantitativa del modelo Excel de Jorge Orozco.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-muted p-1 border border-border" role="tablist">
          <button
            role="tab"
            aria-selected={activeSubTab === "fcl"}
            onClick={() => setActiveSubTab("fcl")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "fcl"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Flujo de Caja Libre (FCL)
          </button>
          <button
            role="tab"
            aria-selected={activeSubTab === "pyg"}
            onClick={() => setActiveSubTab("pyg")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "pyg"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            P&G (Estado de Resultados)
          </button>
          <button
            role="tab"
            aria-selected={activeSubTab === "ktno"}
            onClick={() => setActiveSubTab("ktno")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "ktno"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Capital de Trabajo (KTNO)
          </button>
        </div>
      </div>

      {/* Contenido de Tablas con scroll horizontal accesible */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {activeSubTab === "fcl" && (
          <table className="w-full text-left text-xs text-foreground" aria-label="Tabla de Flujo de Caja Libre">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
              <tr>
                <th scope="col" className="px-4 py-3 min-w-[200px]">Concepto FCL</th>
                {years.map((y) => (
                  <th key={y} scope="col" className="px-4 py-3 text-right min-w-[130px]">
                    Año {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">Utilidad Neta</th>
                {cashFlow.map((cf) => (
                  <td key={cf.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(cf.netIncome)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">+ Depreciación</th>
                {cashFlow.map((cf) => (
                  <td key={cf.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(cf.depreciation)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30 bg-muted/20 font-semibold">
                <th scope="row" className="px-4 py-2.5 font-semibold">(=) Flujo Bruto de Caja</th>
                {cashFlow.map((cf) => (
                  <td key={cf.year} className="px-4 py-2.5 text-right font-mono text-foreground font-semibold">
                    {formatCOP(cf.grossCashFlow)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">(-) Variación KTNO (ΔKTNO)</th>
                {cashFlow.map((cf) => (
                  <td key={cf.year} className="px-4 py-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                    {cf.deltaKtno > 0 ? `-${formatCOP(cf.deltaKtno)}` : formatCOP(cf.deltaKtno)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">(-) Inversión en Activos (CAPEX)</th>
                {cashFlow.map((cf) => (
                  <td key={cf.year} className="px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                    {cf.capex > 0 ? `-${formatCOP(cf.capex)}` : "$0"}
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 border-border bg-blue-50/50 dark:bg-blue-950/30 font-bold text-sm">
                <th scope="row" className="px-4 py-3 text-blue-900 dark:text-blue-200">
                  (=) FLUJO DE CAJA LIBRE (FCL)
                </th>
                {cashFlow.map((cf) => (
                  <td
                    key={cf.year}
                    className={`px-4 py-3 text-right font-mono font-extrabold ${
                      cf.freeCashFlow >= 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {formatCOP(cf.freeCashFlow)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}

        {activeSubTab === "pyg" && (
          <table className="w-full text-left text-xs text-foreground" aria-label="Estado de Resultados Proyectado">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
              <tr>
                <th scope="col" className="px-4 py-3 min-w-[200px]">Rubro de Ingresos & Gastos</th>
                {years.map((y) => (
                  <th key={y} scope="col" className="px-4 py-3 text-right min-w-[130px]">
                    Año {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30 font-semibold bg-emerald-50/20 dark:bg-emerald-950/10">
                <th scope="row" className="px-4 py-2.5 text-emerald-800 dark:text-emerald-300">
                  Ingresos Operacionales
                </th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCOP(is.revenues)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 text-muted-foreground">(-) Costos de Venta y Producción</th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(is.totalCostOfSales)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 text-muted-foreground">(-) Gastos Operacionales (OPEX)</th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(is.operatingExpenses)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 text-muted-foreground">(-) Depreciación</th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(is.depreciation)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30 bg-muted/20 font-semibold">
                <th scope="row" className="px-4 py-2.5">Utilidad Antes de Impuestos</th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono font-semibold">
                    {formatCOP(is.operatingProfitBeforeTax)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 text-rose-600 dark:text-rose-400">
                  (-) Impuesto de Renta ({((incomeStatement[0]?.taxRate ?? 0.32) * 100).toFixed(0)}%)
                </th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                    {formatCOP(is.incomeTax)}
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 border-border bg-emerald-50/40 dark:bg-emerald-950/30 font-bold text-sm">
                <th scope="row" className="px-4 py-3 text-emerald-900 dark:text-emerald-200">
                  UTILIDAD NETA
                </th>
                {incomeStatement.map((is) => (
                  <td key={is.year} className="px-4 py-3 text-right font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatCOP(is.netIncome)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}

        {activeSubTab === "ktno" && (
          <table className="w-full text-left text-xs text-foreground" aria-label="Tabla de Capital de Trabajo Neto Operativo">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
              <tr>
                <th scope="col" className="px-4 py-3 min-w-[200px]">Componente de KTNO</th>
                {years.map((y) => (
                  <th key={y} scope="col" className="px-4 py-3 text-right min-w-[130px]">
                    Año {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">(+) Cuentas por Cobrar (CxC)</th>
                {workingCapital.map((wc) => (
                  <td key={wc.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(wc.cxc)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">(+) Inventarios</th>
                {workingCapital.map((wc) => (
                  <td key={wc.year} className="px-4 py-2.5 text-right font-mono">
                    {formatCOP(wc.inventories)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-2.5 font-medium">(-) Cuentas por Pagar (CxP)</th>
                {workingCapital.map((wc) => (
                  <td key={wc.year} className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                    {formatCOP(wc.cxp)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/30 bg-muted/20 font-semibold">
                <th scope="row" className="px-4 py-2.5">(=) KTNO Total Requerido</th>
                {workingCapital.map((wc) => (
                  <td key={wc.year} className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                    {formatCOP(wc.ktno)}
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 border-border bg-amber-50/50 dark:bg-amber-950/30 font-bold">
                <th scope="row" className="px-4 py-3 text-amber-900 dark:text-amber-200">
                  VARIACIÓN KTNO (Inversión en Caja del Período)
                </th>
                {workingCapital.map((wc) => (
                  <td key={wc.year} className="px-4 py-3 text-right font-mono font-extrabold text-amber-700 dark:text-amber-400">
                    {formatCOP(wc.deltaKtno)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

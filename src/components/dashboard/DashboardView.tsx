"use client";

import React from "react";
import {
  Award,
  DollarSign,
  Users,
  Briefcase,
  Layers,
  Leaf,
  FileSpreadsheet,
  Building2,
  RotateCcw,
  Target,
  ShieldAlert,
  Scale,
} from "lucide-react";
import { useProject, type DashboardTabId } from "@/context/ProjectContext";
import { ResultsKPIs } from "./ResultsKPIs";
import { FinancialTables } from "./FinancialTables";
import { RevenueManager } from "./RevenueManager";
import { PayrollManager } from "./PayrollManager";
import { CapexManager } from "./CapexManager";
import { OpexManager } from "./OpexManager";
import { WorkingCapitalManager } from "./WorkingCapitalManager";
import { EnvironmentalManager } from "./EnvironmentalManager";
import { MarketManager } from "./MarketManager";
import { RiskManager } from "./RiskManager";
import { LegalTechnicalSummary } from "./LegalTechnicalSummary";
import { ExportReportModal } from "./ExportReportModal";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { IncomeEvolutionChart } from "@/components/charts/IncomeEvolutionChart";

interface TabItem {
  id: DashboardTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: "kpis", label: "Resumen & KPIs", icon: Award },
  { id: "revenues", label: "Ingresos & Precios", icon: DollarSign },
  { id: "market", label: "Estudio de Mercado (Radar)", icon: Target },
  { id: "payroll", label: "Nómina Colombiana", icon: Users },
  { id: "capex", label: "Inversiones CAPEX", icon: Briefcase },
  { id: "expenses", label: "Insumos & OPEX", icon: Building2 },
  { id: "ktno", label: "Capital de Trabajo (KTNO)", icon: Layers },
  { id: "cashflow", label: "Estados Financieros (P&G / FCL)", icon: FileSpreadsheet },
  { id: "conesa", label: "Matriz Ambiental (Conesa)", icon: Leaf },
  { id: "risks", label: "Matriz de Riesgos & Heatmap", icon: ShieldAlert },
  { id: "legal", label: "Estudio Legal & Técnico", icon: Scale },
];

export function DashboardView() {
  const { activeTab, setActiveTab, resetToDefault } = useProject();

  const renderContent = () => {
    switch (activeTab) {
      case "kpis":
        return (
          <div className="space-y-6">
            <ResultsKPIs />
            {/* Gráficos Recharts Interactivos en Dashboard Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashFlowChart height={340} />
              <IncomeEvolutionChart height={340} />
            </div>
            <FinancialTables />
          </div>
        );
      case "revenues":
        return <RevenueManager />;
      case "market":
        return <MarketManager />;
      case "payroll":
        return <PayrollManager />;
      case "capex":
        return <CapexManager />;
      case "expenses":
        return <OpexManager />;
      case "ktno":
        return <WorkingCapitalManager />;
      case "cashflow":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashFlowChart height={340} />
              <IncomeEvolutionChart height={340} />
            </div>
            <FinancialTables />
          </div>
        );
      case "conesa":
        return <EnvironmentalManager />;
      case "risks":
        return <RiskManager />;
      case "legal":
        return <LegalTechnicalSummary />;
      default:
        return <ResultsKPIs />;
    }
  };

  return (
    <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-6 pb-20">
      {/* Barra de pestañas modulares */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-6 gap-4 overflow-x-auto">
        <nav
          role="tablist"
          aria-label="Pestañas de estudios del proyecto"
          className="flex items-center gap-1.5"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-xs dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100 ring-2 ring-violet-500/20"
                    : "border-transparent bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Acciones del Dashboard: Exportar PDF & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <ExportReportModal />

          <button
            type="button"
            onClick={resetToDefault}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            title="Restablecer al Benchmark de Jorge Orozco"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Reiniciar Benchmark</span>
          </button>
        </div>
      </div>

      {/* Contenido modular activo */}
      <div>{renderContent()}</div>
    </div>
  );
}

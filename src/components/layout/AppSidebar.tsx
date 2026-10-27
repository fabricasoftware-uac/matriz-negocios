"use client";

import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  ShieldAlert,
  Leaf,
  Scale,
  Sparkles,
  BarChart3,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { useProject, type DashboardTabId } from "@/context/ProjectContext";

interface NavItem {
  id: DashboardTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "kpis", label: "Tablero", icon: LayoutDashboard },
  { id: "cashflow", label: "Proyecciones (P&G, FCL)", icon: TrendingUp },
  { id: "payroll", label: "Nómina Colombiana", icon: Users, badge: "5" },
  { id: "capex", label: "Inversión & CAPEX", icon: Briefcase },
  { id: "market", label: "Estudio de Mercado", icon: Target, badge: "6" },
  { id: "risks", label: "Matriz de Riesgos", icon: ShieldAlert, badge: "7" },
  { id: "conesa", label: "Matriz Ambiental", icon: Leaf },
  { id: "legal", label: "Estudio Legal & Técnico", icon: Scale },
];

export function AppSidebar() {
  const {
    navMode,
    setNavMode,
    activeTab,
    setActiveTab,
    engineOutput,
    currentStep,
  } = useProject();

  const { irr, excelNpv } = engineOutput;
  const tirPercent = (irr * 100).toFixed(1);
  const vpnMillions = (excelNpv / 1_000_000).toFixed(1);

  const handleSelectNav = (tabId: DashboardTabId) => {
    if (navMode !== "dashboard") {
      setNavMode("dashboard");
    }
    setActiveTab(tabId);
  };

  return (
    <aside
      className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-screen sticky top-0 h-screen select-none z-20 transition-colors shadow-[1px_0_10px_rgba(15,23,42,0.02)]"
      aria-label="Barra lateral de navegación"
    >
      {/* Sección Superior: Logo & Marca */}
      <div className="flex flex-col">
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-violet-500/20">
            <Target className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                MatrizPro
              </span>
              <span className="text-[10px] font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-1.5 py-0.2 rounded-md">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
              Evaluación Jorge Orozco
            </p>
          </div>
        </div>

        {/* Conmutador de Modo de Trabajo */}
        <div className="p-3">
          <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setNavMode("wizard")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                navMode === "wizard"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span>Wizard ({currentStep}/7)</span>
            </button>
            <button
              type="button"
              onClick={() => setNavMode("dashboard")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                navMode === "dashboard"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Tablero</span>
            </button>
          </div>
        </div>

        {/* Lista de Navegación Vertical */}
        <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 block">
            Módulos del Proyecto
          </span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = navMode === "dashboard" && activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? "bg-violet-50 text-violet-900 dark:bg-slate-800 dark:text-white font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-violet-700 dark:text-violet-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-violet-200/80 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección Inferior: Widget de Viabilidad + Perfil de Usuario */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Indicador de Viabilidad */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Viabilidad TIR
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {tirPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-slate-900 dark:bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Number(tirPercent) || 73.1, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>VPN acumulado:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              ${vpnMillions}M
            </span>
          </div>
        </div>

        {/* Perfil del Evaluador */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-violet-600 dark:to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100 dark:ring-slate-800">
              JO
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                Jorge Orozco
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                Owner / Evaluador
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Opciones de perfil"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

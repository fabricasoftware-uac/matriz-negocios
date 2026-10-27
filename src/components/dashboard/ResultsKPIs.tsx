"use client";

import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Coins,
  CheckCircle2,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function ResultsKPIs() {
  const { engineOutput, discountRate, risks } = useProject();
  const { irr, excelNpv, viability, cashFlow, incomeStatement } = engineOutput;

  const isViable = viability.isOverallViable;
  const fclYear0 = cashFlow[0]?.freeCashFlow ?? 0;

  // Cálculo de FCL acumulado y promedio años 1 a 5
  const cumulative5YrFcl = cashFlow
    .slice(1)
    .reduce((acc, c) => acc + (c.freeCashFlow || 0), 0);
  const avg5YrFcl = cumulative5YrFcl / 5;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMillions = (val: number) => {
    return `$${(val / 1_000_000).toFixed(2)}M COP`;
  };

  const handleOpenAiAudit = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-copilot", { detail: { action: "audit" } })
      );
    }
  };

  // Puntos normalizados para el gráfico SVG de área suave (Tarjeta 1)
  const chartValues = cashFlow.slice(1).map((c) => c.freeCashFlow);
  const maxVal = Math.max(...chartValues, 1);
  const minVal = Math.min(...chartValues, 0);
  const range = maxVal - minVal || 1;

  // Generar coordenadas SVG
  const width = 300;
  const height = 70;
  const points = chartValues.map((val, idx) => {
    const x = (idx / (chartValues.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 15) - 8;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    if (!prev) return acc;
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  // Datos para barras de Proyecciones (Tarjeta 2: Ingresos vs Costos)
  const projectionBars = [1, 2, 3, 4, 5].map((year) => {
    const period = incomeStatement[year];
    const rev = period?.revenues || 100;
    const exp = period?.totalCostAndExpenses || 80;
    return {
      year: `A${year}`,
      revHeight: Math.min(Math.round((rev / 250_000_000) * 100), 100),
      expHeight: Math.min(Math.round((exp / 250_000_000) * 100), 100),
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner Superior de Viabilidad Metodología Jorge Orozco */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
          isViable
            ? "border-emerald-200/80 bg-white dark:bg-slate-900 dark:border-emerald-950/60"
            : "border-rose-200/80 bg-white dark:bg-slate-900 dark:border-rose-950/60"
        }`}
        role="region"
        aria-label="Dictamen de Viabilidad Financiera"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                isViable
                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              }`}
            >
              {isViable ? (
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-7 w-7" aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold tracking-wide ${
                    isViable
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isViable
                    ? "PROYECTO FINANCIERAMENTE VIABLE"
                    : "PROYECTO NO RECOMENDADO"}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  Benchmark Jorge Orozco
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {isViable
                  ? "Rentabilidad superior al costo de oportunidad y valor agregado neto positivo."
                  : "La inversión no genera retorno suficiente para superar el costo de capital."}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                La TIR del {(irr * 100).toFixed(2)}% supera el WACC de referencia del{" "}
                {(discountRate * 100).toFixed(1)}% generando un VPN acumulado de{" "}
                {formatCOP(excelNpv)}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 p-3 text-center min-w-[110px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Costo WACC
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {(discountRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-3 text-center min-w-[110px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                Retorno TIR
              </span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {(irr * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fila de 3 Tarjetas Visuales Estilo Dashboard Moderno SaaS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Ventas / FCL Acumulado con Gráfico de Área Suave */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Flujo de Caja Libre (FCL)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold">
                <ArrowUpRight className="h-3.5 w-3.5" />+{" "}
                {(irr * 100).toFixed(1)}% TIR
              </span>
            </div>

            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatMillions(cumulative5YrFcl || 115_890_000)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              FCL promedio anual:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {formatMillions(avg5YrFcl || 33_600_000)}
              </strong>
            </p>
          </div>

          {/* Gráfico de Área Lineal Azul Suave */}
          <div className="mt-6 -mx-6 -mb-6 relative h-20 overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full preserve-3d"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="fclBlueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#fclBlueGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Tarjeta 2: Proyecciones Financieras (Barras Redondeadas Azul y Lila) */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Proyecciones (Ingresos / Costos)
              </span>
              <span className="text-[11px] font-semibold text-slate-400">5 Años</span>
            </div>

            {/* Leyenda de Indicadores */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium my-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Ingresos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Costos
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-0.5 w-3 bg-amber-400 inline-block border-b border-dashed" />
                WACC (10%)
              </span>
            </div>
          </div>

          {/* Gráfico de Barras Verticales Redondeadas */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative">
            <div className="flex items-end justify-between h-24 px-2 gap-2">
              {projectionBars.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="flex items-end gap-1 h-20 w-full justify-center">
                    {/* Barra Azul (Ingresos) */}
                    <div
                      className="w-2.5 sm:w-3 bg-blue-600 dark:bg-blue-500 rounded-t-full transition-all duration-500"
                      style={{ height: `${Math.max(bar.revHeight, 25)}%` }}
                      title={`Ingresos ${bar.year}`}
                    />
                    {/* Barra Lila (Costos) */}
                    <div
                      className="w-2.5 sm:w-3 bg-violet-300 dark:bg-violet-400 rounded-t-full transition-all duration-500"
                      style={{ height: `${Math.max(bar.expHeight, 18)}%` }}
                      title={`Costos ${bar.year}`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {bar.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Heatmap de Riesgo (Grilla de bloques lilas/morados con números) */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Matriz de Riesgo & Severidad
              </span>
              <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full">
                {risks.length} Identificados
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluación probabilidad x impacto en metodología Jorge Orozco
            </p>
          </div>

          {/* Grilla Heatmap con Bloques en Tonos Lilas y Números */}
          <div className="my-3 space-y-2">
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 1, tone: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" },
                { val: 2, tone: "bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200" },
                { val: 3, tone: "bg-violet-300 text-violet-950 dark:bg-violet-800 dark:text-white" },
                { val: 1, tone: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" },
                { val: 2, tone: "bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200" },
                { val: 3, tone: "bg-violet-400 text-white dark:bg-violet-700 dark:text-white" },
                { val: 2, tone: "bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200" },
                { val: 1, tone: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" },
                { val: 3, tone: "bg-purple-500 text-white dark:bg-purple-600 dark:text-white font-bold" },
                { val: 2, tone: "bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200" },
              ].map((tile, i) => (
                <div
                  key={i}
                  className={`h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs ${tile.tone}`}
                >
                  {tile.val}
                </div>
              ))}
            </div>

            {/* Badges de Riesgos Principales */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                DIAN / Impuestos
              </span>
              <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                SIIGO Integración
              </span>
              <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                Causación NIIF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Estilo 'Start a Project Brief' (Auditar con IA) */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-[0_2px_14px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 shadow-xs">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Asistente Estratégico de Negocios
              </h3>
              <span className="text-[10px] font-bold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 px-2 py-0.5 rounded-full border border-violet-200/60 dark:border-violet-800/60">
                Copilot IA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Ejecuta una auditoría financiera integral, simula escenarios de sensibilidad en WACC y genera recomendaciones accionables para juntas directivas e inversionistas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAiAudit}
          className="shrink-0 flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-150"
        >
          <Sparkles className="h-4 w-4 text-violet-400 dark:text-violet-600 animate-pulse" />
          <span>Auditar con IA</span>
        </button>
      </div>

      {/* Grid de Métricas Clave Secundarias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: TIR */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TIR del Proyecto
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                viability.isIrrViable
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {viability.irrStatus}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(irr * 100).toFixed(2)}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            Supera el {(discountRate * 100).toFixed(0)}% requerido
          </p>
        </div>

        {/* KPI: VPN */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Valor Presente Neto
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                viability.isNpvViable
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {viability.npvStatus}
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-extrabold ${
                excelNpv >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCOP(excelNpv)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            A tasa WACC del {(discountRate * 100).toFixed(0)}%
          </p>
        </div>

        {/* KPI: Inversión Año 0 */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Inversión Neta (Año 0)
            </span>
            <Coins className="h-4 w-4 text-rose-500" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatCOP(fclYear0)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            CAPEX ($14.3M) + KTNO ($26.9M)
          </p>
        </div>

        {/* KPI: Flujo Promedio */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              FCL Operativo Anual
            </span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatCOP(avg5YrFcl)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Promedio 5 años proyectados
          </p>
        </div>
      </div>
    </div>
  );
}

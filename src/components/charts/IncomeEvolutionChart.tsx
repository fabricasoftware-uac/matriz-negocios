"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useProject } from "@/context/ProjectContext";
import type { IncomeStatementPeriod } from "@/lib/financial-engine";

interface IncomeEvolutionChartProps {
  data?: IncomeStatementPeriod[];
  height?: number;
}

export function IncomeEvolutionChart({ data, height = 360 }: IncomeEvolutionChartProps) {
  const { engineOutput } = useProject();
  const incomeData = data ?? engineOutput.incomeStatement;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMillionsCOP = (val: number) => {
    return `$${(val / 1_000_000).toFixed(0)}M`;
  };

  const chartSeries = useMemo(() => {
    return incomeData.map((item) => ({
      year: `Año ${item.year}`,
      yearNumber: item.year,
      revenues: Math.round(item.revenues),
      costsAndExpenses: Math.round(item.totalCostAndExpenses),
      netIncome: Math.round(item.netIncome),
      operatingProfit: Math.round(item.operatingProfitBeforeTax),
    }));
  }, [incomeData]);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-border mb-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Evolución de Ingresos vs. Costos vs. Utilidad Neta
          </h4>
          <p className="text-xs text-muted-foreground">
            Comportamiento proyectado del Estado de Resultados durante el horizonte de 5 años
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
            <span className="h-2.5 w-2.5 rounded-xs bg-blue-500 inline-block" /> Ingresos
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-500 inline-block" /> Costos y Gastos
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500 inline-block" /> Utilidad Neta
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartSeries}
            margin={{ top: 20, right: 20, bottom: 20, left: 15 }}
          >
            <defs>
              <linearGradient id="colorRevenues" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              tickFormatter={formatMillionsCOP}
              tick={{ fill: "currentColor", fontSize: 11 }}
              width={75}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0]?.payload;
                if (!row) return null;
                const netMargin =
                  row.revenues > 0 ? ((row.netIncome / row.revenues) * 100).toFixed(1) : "0.0";
                return (
                  <div className="rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-bold text-foreground text-sm">{row.year}</p>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Margen Neto: {netMargin}%
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500" /> Ingresos Totales:
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {formatCOP(row.revenues)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Costos & Gastos:
                        </span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {formatCOP(row.costsAndExpenses)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Utilidad Neta:
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCOP(row.netIncome)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              formatter={(value) => {
                if (value === "revenues") return "Ingresos Operacionales";
                if (value === "costsAndExpenses") return "Costos & Gastos Totales";
                if (value === "netIncome") return "Utilidad Neta";
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenues"
              name="revenues"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRevenues)"
            />
            <Area
              type="monotone"
              dataKey="costsAndExpenses"
              name="costsAndExpenses"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCosts)"
            />
            <Area
              type="monotone"
              dataKey="netIncome"
              name="netIncome"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorNet)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

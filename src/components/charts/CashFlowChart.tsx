"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";
import { useProject } from "@/context/ProjectContext";
import type { CashFlowPeriodResult } from "@/lib/financial-engine";

interface CashFlowChartProps {
  data?: CashFlowPeriodResult[];
  height?: number;
}

export function CashFlowChart({ data, height = 360 }: CashFlowChartProps) {
  const { engineOutput } = useProject();
  const cashFlowData = data ?? engineOutput.cashFlow;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMillionsCOP = (val: number) => {
    return `$${(val / 1_000_000).toFixed(1)}M`;
  };

  const chartSeries = useMemo(() => {
    let runningAccumulator = 0;
    return cashFlowData.map((item) => {
      runningAccumulator += item.freeCashFlow;
      return {
        year: `Año ${item.year}`,
        yearNumber: item.year,
        fcl: Math.round(item.freeCashFlow),
        cumulative: Math.round(runningAccumulator),
        ebitda: Math.round(item.ebitda),
        netIncome: Math.round(item.netIncome),
      };
    });
  }, [cashFlowData]);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-border mb-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Flujo de Caja Libre & Caja Acumulada
          </h4>
          <p className="text-xs text-muted-foreground">
            Trayectoria del FCL anual (Barras) y efecto acumulativo en tesorería (Línea)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500 inline-block" /> FCL Positivo
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-xs bg-rose-500 inline-block" /> FCL Negativo (Inversión)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
            <span className="h-1 w-3 rounded-full bg-blue-600 inline-block" /> Caja Acumulada
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartSeries}
            margin={{ top: 20, right: 20, bottom: 20, left: 15 }}
          >
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
                return (
                  <div className="rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
                    <p className="font-bold text-foreground text-sm mb-1.5">{row.year}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Flujo Libre (FCL):</span>
                        <span
                          className={`font-mono font-bold ${
                            row.fcl >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {formatCOP(row.fcl)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Caja Acumulada:</span>
                        <span
                          className={`font-mono font-bold ${
                            row.cumulative >= 0
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {formatCOP(row.cumulative)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50 text-[11px]">
                        <span className="text-muted-foreground">Utilidad Neta:</span>
                        <span className="font-mono text-foreground font-medium">
                          {formatCOP(row.netIncome)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-[11px]">
                        <span className="text-muted-foreground">EBITDA:</span>
                        <span className="font-mono text-foreground font-medium">
                          {formatCOP(row.ebitda)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine y={0} stroke="rgba(156, 163, 175, 0.6)" strokeWidth={1.5} />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              formatter={(value) => {
                if (value === "fcl") return "Flujo de Caja Libre";
                if (value === "cumulative") return "Caja Acumulada";
                return value;
              }}
            />
            <Bar dataKey="fcl" name="fcl" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartSeries.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fcl >= 0 ? "#10b981" : "#f43f5e"}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="cumulative"
              name="cumulative"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#ffffff" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

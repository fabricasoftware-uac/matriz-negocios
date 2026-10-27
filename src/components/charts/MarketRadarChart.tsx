"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { useProject } from "@/context/ProjectContext";
import { MARKET_ATTRIBUTES } from "@/lib/financial-engine";

interface MarketRadarChartProps {
  height?: number;
  showControls?: boolean;
}

export function MarketRadarChart({
  height = 420,
  showControls = true,
}: MarketRadarChartProps) {
  const { ourCompanyScores, competitors } = useProject();

  // Permite seleccionar qué competidores están activos en el radar
  // Por defecto: Nuestra Empresa siempre activa + Raw Talent (principal) + Promedio de mercado
  const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([
    "raw-talent",
    "dc-influenc",
  ]);
  const [showAverage, setShowAverage] = useState<boolean>(true);

  // Cálculo del promedio de competidores por atributo
  const marketAverages = useMemo(() => {
    const avg: Record<string, number> = {};
    for (const attr of MARKET_ATTRIBUTES) {
      const sum = competitors.reduce((acc, c) => acc + (c.scores[attr.id] ?? 0), 0);
      avg[attr.id] = Number((sum / Math.max(1, competitors.length)).toFixed(1));
    }
    return avg;
  }, [competitors]);

  // Formato de datos para Recharts Radar
  const radarData = useMemo(() => {
    return MARKET_ATTRIBUTES.map((attr) => {
      const entry: Record<string, string | number> = {
        attribute: attr.name,
        fullAttribute: attr.description,
        ourCompany: ourCompanyScores[attr.id] ?? 0,
        marketAverage: marketAverages[attr.id] ?? 0,
      };

      for (const comp of competitors) {
        entry[comp.competitorId] = comp.scores[attr.id] ?? 0;
      }

      return entry;
    });
  }, [ourCompanyScores, competitors, marketAverages]);

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllCompetitors = () => {
    setSelectedCompetitorIds(competitors.map((c) => c.competitorId));
  };

  const clearCompetitors = () => {
    setSelectedCompetitorIds([]);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-border mb-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Radar Competitivo Multidimensional (11 Atributos)
          </h4>
          <p className="text-xs text-muted-foreground">
            Comparativa en escala 1 a 10 frente a competidores y promedio del mercado
          </p>
        </div>

        {showControls && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAllCompetitors}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Ver todos
            </button>
            <span className="text-muted-foreground text-xs">•</span>
            <button
              type="button"
              onClick={clearCompetitors}
              className="text-[11px] font-semibold text-muted-foreground hover:underline cursor-pointer"
            >
              Solo Nuestra Empresa
            </button>
          </div>
        )}
      </div>

      {/* Selectores de competidores */}
      {showControls && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Badge Nuestra Empresa */}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600/30 bg-blue-50/80 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Nuestra Empresa (Fija)
          </span>

          {/* Toggle Promedio de Mercado */}
          <button
            type="button"
            onClick={() => setShowAverage(!showAverage)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer border transition-all ${
              showAverage
                ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                showAverage ? "bg-amber-500" : "bg-muted-foreground/40"
              }`}
            />
            Promedio Mercado
          </button>

          {/* Checkboxes por competidor */}
          {competitors.map((comp) => {
            const isSelected = selectedCompetitorIds.includes(comp.competitorId);
            return (
              <button
                key={comp.competitorId}
                type="button"
                onClick={() => toggleCompetitor(comp.competitorId)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer border transition-all ${
                  isSelected
                    ? "border-border shadow-xs bg-card text-foreground"
                    : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
                style={{
                  borderColor: isSelected ? comp.color : undefined,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: isSelected ? comp.color : "#94a3b8",
                  }}
                />
                {comp.competitorName}
              </button>
            );
          })}
        </div>
      )}

      {/* Gráfico Radar Recharts */}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="rgba(156, 163, 175, 0.25)" />
            <PolarAngleAxis
              dataKey="attribute"
              tick={{ fill: "currentColor", fontSize: 10, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "currentColor", fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0]?.payload;
                if (!row) return null;

                return (
                  <div className="rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
                    <p className="font-bold text-foreground text-sm mb-1">{row.attribute}</p>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      {row.fullAttribute}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Nuestra Empresa:
                        </span>
                        <strong className="font-mono text-sm">{row.ourCompany} / 10</strong>
                      </div>

                      {showAverage && (
                        <div className="flex items-center justify-between gap-4 text-amber-600 dark:text-amber-400">
                          <span>Promedio Mercado:</span>
                          <span className="font-mono">{row.marketAverage} / 10</span>
                        </div>
                      )}

                      {competitors
                        .filter((c) => selectedCompetitorIds.includes(c.competitorId))
                        .map((comp) => (
                          <div
                            key={comp.competitorId}
                            className="flex items-center justify-between gap-4 text-muted-foreground"
                          >
                            <span>{comp.competitorName}:</span>
                            <span className="font-mono">{row[comp.competitorId]} / 10</span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              formatter={(value) => {
                if (value === "ourCompany") return "Nuestra Empresa";
                if (value === "marketAverage") return "Promedio Mercado";
                const c = competitors.find((comp) => comp.competitorId === value);
                return c?.competitorName ?? value;
              }}
            />

            {/* Radar: Nuestra Empresa (Destacado) */}
            <Radar
              name="ourCompany"
              dataKey="ourCompany"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.35}
              strokeWidth={3}
            />

            {/* Radar: Promedio de Mercado (Opcional) */}
            {showAverage && (
              <Radar
                name="marketAverage"
                dataKey="marketAverage"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            )}

            {/* Radares de Competidores Seleccionados */}
            {competitors
              .filter((comp) => selectedCompetitorIds.includes(comp.competitorId))
              .map((comp) => (
                <Radar
                  key={comp.competitorId}
                  name={comp.competitorId}
                  dataKey={comp.competitorId}
                  stroke={comp.color}
                  fill={comp.color}
                  fillOpacity={0.15}
                  strokeWidth={1.8}
                />
              ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

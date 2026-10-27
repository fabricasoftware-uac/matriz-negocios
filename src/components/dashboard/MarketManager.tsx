"use client";

import React, { useState } from "react";
import {
  Users,
  Sparkles,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { MARKET_ATTRIBUTES } from "@/lib/financial-engine";
import { MarketRadarChart } from "@/components/charts/MarketRadarChart";

export function MarketManager() {
  const {
    ourCompanyScores,
    competitors,
    updateOurScore,
    updateCompetitorScore,
    resetToDefault,
  } = useProject();

  const [activeTab, setActiveTab] = useState<"radar" | "table">("radar");
  const [editingCompetitorId, setEditingCompetitorId] = useState<string>("ourCompany");

  // Sumatoria total de puntos
  const ourTotal = Object.values(ourCompanyScores).reduce((a, b) => a + b, 0);

  const competitorTotals = competitors.map((c) => ({
    id: c.competitorId,
    name: c.competitorName,
    total: Object.values(c.scores).reduce((a, b) => a + b, 0),
    color: c.color,
  }));

  // Ranking ordenado
  const allRankings = [
    { id: "ourCompany", name: "Nuestra Empresa", total: ourTotal, isUs: true },
    ...competitorTotals.map((c) => ({ ...c, isUs: false })),
  ].sort((a, b) => b.total - a.total);

  const ourRank = allRankings.findIndex((r) => r.isUs) + 1;

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Users className="h-3.5 w-3.5" />
              Estudio de Mercado
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Ranking #{ourRank} de {allRankings.length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1.5">
            Evaluación Competitiva y Percepción del Público
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Calificación ponderada en 11 atributos estratégicos (1 al 10). Compara las fortalezas y brechas de Nuestra Empresa frente a los 6 competidores del sector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs Radar vs Tabla */}
          <div className="inline-flex rounded-xl bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab("radar")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "radar"
                  ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Vista Radar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "table"
                  ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Calificación & Matriz
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen de Competidores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-xl border-2 border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 p-3 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Nuestra Empresa
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {ourTotal}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">/ 110 pts</span>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-1 block">
            Puesto #{ourRank} Líder
          </span>
        </div>

        {competitors.map((comp) => {
          const compTotal = Object.values(comp.scores).reduce((a, b) => a + b, 0);
          const rank = allRankings.findIndex((r) => r.id === comp.competitorId) + 1;
          return (
            <div
              key={comp.competitorId}
              className="rounded-xl border border-border bg-card p-3 shadow-xs hover:border-muted-foreground/40 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: comp.color }}
                />
                <span className="text-xs font-bold text-foreground truncate">
                  {comp.competitorName}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-foreground">
                  {compTotal}
                </span>
                <span className="text-[10px] text-muted-foreground">/ 110</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Puesto #{rank}
              </span>
            </div>
          );
        })}
      </div>

      {/* Vista Activa */}
      {activeTab === "radar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart */}
          <div className="lg:col-span-8">
            <MarketRadarChart height={440} showControls={true} />
          </div>

          {/* Panel Lateral: Ajuste Rápido de Nuestra Empresa */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Ajuste de Atributos Propios
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Mueve los sliders para actualizar el Radar
                </p>
              </div>
              <button
                type="button"
                onClick={resetToDefault}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                title="Restablecer al Benchmark"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {MARKET_ATTRIBUTES.map((attr) => {
                const currentScore = ourCompanyScores[attr.id] ?? 0;
                return (
                  <div
                    key={attr.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-2.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor={`slider-${attr.id}`}
                        className="text-xs font-semibold text-foreground cursor-pointer"
                      >
                        {attr.name}
                      </label>
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {currentScore} / 10
                      </span>
                    </div>
                    <input
                      id={`slider-${attr.id}`}
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={currentScore}
                      onChange={(e) => updateOurScore(attr.id, Number(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-muted rounded-lg cursor-pointer"
                      aria-label={`Calificación para ${attr.name}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Vista Matriz Completa y Sliders */
        <div className="space-y-6">
          {/* Selector de entidad a calificar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-muted-foreground shrink-0">
              Editar entidad:
            </span>
            <button
              type="button"
              onClick={() => setEditingCompetitorId("ourCompany")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                editingCompetitorId === "ourCompany"
                  ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              Nuestra Empresa ({ourTotal} pts)
            </button>
            {competitors.map((comp) => {
              const total = Object.values(comp.scores).reduce((a, b) => a + b, 0);
              const isActive = editingCompetitorId === comp.competitorId;
              return (
                <button
                  key={comp.competitorId}
                  type="button"
                  onClick={() => setEditingCompetitorId(comp.competitorId)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-xs font-bold"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {comp.competitorName} ({total} pts)
                </button>
              );
            })}
          </div>

          {/* Grid de Sliders de la entidad seleccionada */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h4 className="text-sm font-bold text-foreground mb-4">
              Calificación detallada para{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {editingCompetitorId === "ourCompany"
                  ? "Nuestra Empresa"
                  : competitors.find((c) => c.competitorId === editingCompetitorId)?.competitorName}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKET_ATTRIBUTES.map((attr) => {
                const isOur = editingCompetitorId === "ourCompany";
                const currentScore = isOur
                  ? ourCompanyScores[attr.id] ?? 0
                  : competitors.find((c) => c.competitorId === editingCompetitorId)?.scores[attr.id] ?? 0;

                const handleChange = (val: number) => {
                  if (isOur) {
                    updateOurScore(attr.id, val);
                  } else {
                    updateCompetitorScore(editingCompetitorId, attr.id, val);
                  }
                };

                return (
                  <div
                    key={attr.id}
                    className="rounded-xl border border-border bg-muted/10 p-3 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-foreground">{attr.name}</span>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {attr.description}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">
                        {currentScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={currentScore}
                        onChange={(e) => handleChange(Number(e.target.value))}
                        className="flex-1 accent-blue-600 h-2 bg-muted rounded-lg cursor-pointer"
                        aria-label={`Calificar ${attr.name}`}
                      />
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={currentScore}
                        onChange={(e) => handleChange(Number(e.target.value))}
                        className="w-12 rounded-lg border border-border bg-card px-1.5 py-1 text-center font-mono text-xs font-bold text-foreground"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla Comparativa Cruzada Estilo Excel */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs overflow-x-auto">
            <h4 className="text-sm font-bold text-foreground mb-3">
              Matriz Comparativa de Mercado (Benchmark Excel Oficial)
            </h4>
            <table className="w-full text-left text-xs text-foreground" aria-label="Matriz comparativa de competidores">
              <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-semibold border-b border-border">
                <tr>
                  <th scope="col" className="px-3 py-2.5 min-w-[160px]">Atributo</th>
                  <th scope="col" className="px-3 py-2.5 text-center font-bold text-blue-600 dark:text-blue-400 min-w-[90px]">
                    Nuestra Empresa
                  </th>
                  {competitors.map((c) => (
                    <th key={c.competitorId} scope="col" className="px-3 py-2.5 text-center min-w-[80px]">
                      {c.competitorName}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-2.5 text-center font-semibold text-amber-600 dark:text-amber-400 min-w-[80px]">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MARKET_ATTRIBUTES.map((attr) => {
                  const ourVal = ourCompanyScores[attr.id] ?? 0;
                  const compVals = competitors.map((c) => c.scores[attr.id] ?? 0);
                  const allVals = [ourVal, ...compVals];
                  const avg = (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(1);

                  return (
                    <tr key={attr.id} className="hover:bg-muted/30">
                      <th scope="row" className="px-3 py-2 font-medium text-foreground">
                        {attr.name}
                      </th>
                      <td className="px-3 py-2 text-center font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/10">
                        {ourVal}
                      </td>
                      {competitors.map((c) => (
                        <td key={c.competitorId} className="px-3 py-2 text-center font-mono">
                          {c.scores[attr.id] ?? 0}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/5">
                        {avg}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-border bg-muted/40 font-bold">
                <tr>
                  <th scope="row" className="px-3 py-2.5 text-foreground uppercase">
                    Total Puntos
                  </th>
                  <td className="px-3 py-2.5 text-center font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20">
                    {ourTotal}
                  </td>
                  {competitorTotals.map((c) => (
                    <td key={c.id} className="px-3 py-2.5 text-center font-mono text-sm">
                      {c.total}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center font-mono text-sm text-amber-600 dark:text-amber-400">
                    {(
                      [ourTotal, ...competitorTotals.map((c) => c.total)].reduce((a, b) => a + b, 0) /
                      (competitors.length + 1)
                    ).toFixed(1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

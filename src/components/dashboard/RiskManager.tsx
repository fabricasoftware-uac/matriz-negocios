"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  FileText,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import {
  type RiskItem,
  type RiskLevel,
  PROBABILITY_LABELS,
  IMPACT_LABELS,
  calculateRiskLevel,
} from "@/lib/financial-engine";

export function RiskManager() {
  const { risks, addRisk, updateRisk, removeRisk, resetToDefault } = useProject();

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<RiskLevel | "Todos">("Todos");
  const [selectedCell, setSelectedCell] = useState<{ prob: number; imp: number } | null>(null);

  // Estado para creación/edición de riesgo
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [formRisk, setFormRisk] = useState<{
    process: string;
    risk: string;
    probability: number;
    impact: number;
    control: string;
    whatItControls: string;
  }>({
    process: "Gestión Financiera",
    risk: "",
    probability: 2,
    impact: 2,
    control: "",
    whatItControls: "",
  });

  // Conteo por nivel
  const levelCounts = useMemo(() => {
    return {
      Bajo: risks.filter((r) => r.level === "Bajo").length,
      Moderado: risks.filter((r) => r.level === "Moderado").length,
      Alto: risks.filter((r) => r.level === "Alto").length,
      Extremo: risks.filter((r) => r.level === "Extremo").length,
    };
  }, [risks]);

  // Filtrado de riesgos
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      if (selectedCell) {
        return r.probability === selectedCell.prob && r.impact === selectedCell.imp;
      }
      if (selectedLevelFilter !== "Todos") {
        return r.level === selectedLevelFilter;
      }
      return true;
    });
  }, [risks, selectedLevelFilter, selectedCell]);

  const handleOpenAdd = () => {
    setEditingRiskId(null);
    setFormRisk({
      process: "Gestión Financiera",
      risk: "",
      probability: 2,
      impact: 2,
      control: "",
      whatItControls: "",
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: RiskItem) => {
    setEditingRiskId(item.id);
    setFormRisk({
      process: item.process,
      risk: item.risk,
      probability: item.probability,
      impact: item.impact,
      control: item.control,
      whatItControls: item.whatItControls,
    });
    setIsEditing(true);
  };

  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRisk.risk.trim() || !formRisk.control.trim()) return;

    const probLabel = PROBABILITY_LABELS[formRisk.probability] || "Posible";
    const impLabel = IMPACT_LABELS[formRisk.impact] || "Moderado";

    if (editingRiskId) {
      updateRisk(editingRiskId, {
        process: formRisk.process,
        risk: formRisk.risk,
        probability: formRisk.probability,
        probabilityLabel: probLabel,
        impact: formRisk.impact,
        impactLabel: impLabel,
        control: formRisk.control,
        whatItControls: formRisk.whatItControls,
      });
    } else {
      addRisk({
        process: formRisk.process,
        risk: formRisk.risk,
        probability: formRisk.probability,
        probabilityLabel: probLabel,
        impact: formRisk.impact,
        impactLabel: impLabel,
        control: formRisk.control,
        whatItControls: formRisk.whatItControls,
      });
    }

    setIsEditing(false);
  };

  // Color de celda en heatmap 5x5
  const getCellBgColor = (prob: number, imp: number, isSelected: boolean) => {
    const level = calculateRiskLevel(prob, imp);
    const hasRisk = risks.some((r) => r.probability === prob && r.impact === imp);

    if (isSelected) {
      return "ring-3 ring-blue-600 dark:ring-blue-400 z-10 scale-105 shadow-md";
    }

    switch (level) {
      case "Bajo":
        return hasRisk
          ? "bg-emerald-500/30 hover:bg-emerald-500/40 border-emerald-500/60 text-emerald-950 dark:text-emerald-100"
          : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-muted-foreground";
      case "Moderado":
        return hasRisk
          ? "bg-amber-500/30 hover:bg-amber-500/40 border-amber-500/60 text-amber-950 dark:text-amber-100"
          : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-muted-foreground";
      case "Alto":
        return hasRisk
          ? "bg-rose-500/30 hover:bg-rose-500/40 border-rose-500/60 text-rose-950 dark:text-rose-100"
          : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-muted-foreground";
      case "Extremo":
        return hasRisk
          ? "bg-purple-500/40 hover:bg-purple-500/50 border-purple-500/70 text-purple-950 dark:text-purple-100 font-bold"
          : "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              Gestión de Riesgos Financieros
            </span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {risks.length} Riesgos Evaluados
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1.5">
            Matriz de Riesgos & Mapa de Calor (5x5)
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Identificación de vulnerabilidades operativas y tributarias (DIAN, SIIGO, causación, fraude y presupuesto), clasificados por probabilidad e impacto con sus controles y mitigaciones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetToDefault}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            title="Restablecer riesgos al benchmark oficial"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Riesgos</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Riesgo</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas de Riesgo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            setSelectedCell(null);
            setSelectedLevelFilter(selectedLevelFilter === "Bajo" ? "Todos" : "Bajo");
          }}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            selectedLevelFilter === "Bajo"
              ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20"
              : "border-border bg-card hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Riesgo Bajo
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {levelCounts.Bajo}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Control preventivo rutinario</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCell(null);
            setSelectedLevelFilter(selectedLevelFilter === "Moderado" ? "Todos" : "Moderado");
          }}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            selectedLevelFilter === "Moderado"
              ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20"
              : "border-border bg-card hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
              Riesgo Moderado
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {levelCounts.Moderado}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Seguimiento trimestral</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCell(null);
            setSelectedLevelFilter(selectedLevelFilter === "Alto" ? "Todos" : "Alto");
          }}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            selectedLevelFilter === "Alto"
              ? "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500/20"
              : "border-border bg-card hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
              Riesgo Alto
            </span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {levelCounts.Alto}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Auditoría y control especial</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCell(null);
            setSelectedLevelFilter(selectedLevelFilter === "Extremo" ? "Todos" : "Extremo");
          }}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            selectedLevelFilter === "Extremo"
              ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-500/20"
              : "border-border bg-card hover:border-purple-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
              Riesgo Extremo
            </span>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {levelCounts.Extremo}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Intervención prioritaria</p>
        </button>
      </div>

      {/* Heatmap 5x5 Interactivo y Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap 5x5 */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Mapa de Calor 5x5 (Probabilidad vs. Impacto)
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Haz clic en una celda para filtrar los riesgos ubicados en ella
              </p>
            </div>
            {selectedCell && (
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Limpiar selección
              </button>
            )}
          </div>

          {/* Grilla 5x5 */}
          <div className="relative">
            {/* Eje Y: Probabilidad */}
            <div className="flex">
              <div className="w-20 pr-2 flex flex-col justify-between py-1 text-right text-[10px] font-semibold text-muted-foreground">
                <span>5 Casi Seguro</span>
                <span>4 Probable</span>
                <span>3 Posible</span>
                <span>2 Improbable</span>
                <span>1 Raro</span>
              </div>

              {/* Matriz de Celdas 5x5 */}
              <div className="flex-1 grid grid-rows-5 gap-1.5">
                {[5, 4, 3, 2, 1].map((prob) => (
                  <div key={prob} className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((imp) => {
                      const matchingRisks = risks.filter(
                        (r) => r.probability === prob && r.impact === imp
                      );
                      const isSelected =
                        selectedCell?.prob === prob && selectedCell?.imp === imp;

                      return (
                        <button
                          key={`${prob}-${imp}`}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCell(null);
                            } else {
                              setSelectedCell({ prob, imp });
                              setSelectedLevelFilter("Todos");
                            }
                          }}
                          className={`h-11 rounded-lg border flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative ${getCellBgColor(
                            prob,
                            imp,
                            isSelected
                          )}`}
                          title={`Prob: ${PROBABILITY_LABELS[prob]} (${prob}), Impacto: ${IMPACT_LABELS[imp]} (${imp}) - ${matchingRisks.length} riesgos`}
                        >
                          <span className="text-[10px] font-mono opacity-60">
                            {prob * imp}
                          </span>
                          {matchingRisks.length > 0 && (
                            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-extrabold px-1">
                              {matchingRisks.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Eje X: Impacto */}
            <div className="flex pl-20 pt-2">
              <div className="flex-1 grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold text-muted-foreground">
                <span>1 Insignificante</span>
                <span>2 Menor</span>
                <span>3 Moderado</span>
                <span>4 Mayor</span>
                <span>5 Catastrófico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Informativo del Objetivo de Gestión de Riesgo (Excel) */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-bold text-foreground">
                Marco de Control y Gobernanza (Benchmark Oficial)
              </h4>
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                <strong className="text-foreground block mb-0.5">Proceso:</strong>
                Gestión Financiera & Tributaria
              </div>
              <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                <strong className="text-foreground block mb-0.5">Objetivo Misional:</strong>
                Garantizar la disponibilidad del recurso para la ejecución de las operaciones de la entidad. Suministrar información estratégica financiera requerida para la toma de decisiones. Llevar la información contable bajo NIIF y normativa DIAN vigente.
              </div>
              <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                <strong className="text-foreground block mb-0.5">Responsable Institucional:</strong>
                Área Contable y Financiera / Contador Público / Revisoría Fiscal
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Filtro activo:{" "}
              <strong className="text-foreground">
                {selectedCell
                  ? `Prob ${selectedCell.prob} x Imp ${selectedCell.imp}`
                  : selectedLevelFilter}
              </strong>
            </span>
            {(selectedCell || selectedLevelFilter !== "Todos") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCell(null);
                  setSelectedLevelFilter("Todos");
                }}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Ver todos los riesgos ({risks.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Formulario de Creación / Edición */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="rounded-2xl border-2 border-blue-600 bg-card p-6 shadow-xl"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
            <h4 className="text-base font-bold text-foreground">
              {editingRiskId ? "Editar Riesgo Identificado" : "Registrar Nuevo Riesgo Financiero"}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSaveRisk} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Descripción del Riesgo
                </label>
                <textarea
                  rows={2}
                  required
                  value={formRisk.risk}
                  onChange={(e) => setFormRisk({ ...formRisk, risk: e.target.value })}
                  placeholder="Ej: Errores en la liquidación de IVA..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Probabilidad (1 a 5): {PROBABILITY_LABELS[formRisk.probability]}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={formRisk.probability}
                  onChange={(e) =>
                    setFormRisk({ ...formRisk, probability: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Impacto (1 a 5): {IMPACT_LABELS[formRisk.impact]}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={formRisk.impact}
                  onChange={(e) =>
                    setFormRisk({ ...formRisk, impact: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Control Implementado
                </label>
                <input
                  type="text"
                  required
                  value={formRisk.control}
                  onChange={(e) => setFormRisk({ ...formRisk, control: e.target.value })}
                  placeholder="Ej: Verificación en Siigo y segunda revisión por contador..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  ¿Qué controla? (Mitigación)
                </label>
                <input
                  type="text"
                  required
                  value={formRisk.whatItControls}
                  onChange={(e) => setFormRisk({ ...formRisk, whatItControls: e.target.value })}
                  placeholder="Ej: Errores humanos y sanciones tributarias..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                {editingRiskId ? "Guardar Cambios" : "Agregar a la Matriz"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla Interactiva de Registro de Riesgos */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Registro Detallado de Controles y Mitigaciones
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Mostrando {filteredRisks.length} de {risks.length} riesgos registrados
            </p>
          </div>
        </div>

        <table className="w-full text-left text-xs text-foreground" aria-label="Tabla de matriz de riesgos">
          <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-semibold border-b border-border">
            <tr>
              <th scope="col" className="px-3 py-2.5 min-w-[200px]">Riesgo</th>
              <th scope="col" className="px-3 py-2.5 text-center min-w-[100px]">Probabilidad</th>
              <th scope="col" className="px-3 py-2.5 text-center min-w-[100px]">Impacto</th>
              <th scope="col" className="px-3 py-2.5 text-center min-w-[90px]">Evaluación</th>
              <th scope="col" className="px-3 py-2.5 min-w-[200px]">Control</th>
              <th scope="col" className="px-3 py-2.5 min-w-[200px]">¿Qué controla?</th>
              <th scope="col" className="px-3 py-2.5 text-right min-w-[80px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRisks.map((item) => {
              const levelBadgeColor =
                item.level === "Bajo"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : item.level === "Moderado"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : item.level === "Alto"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";

              return (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3 font-medium text-foreground">
                    {item.risk}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono font-semibold block">{item.probability}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.probabilityLabel}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono font-semibold block">{item.impact}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.impactLabel}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${levelBadgeColor}`}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-[11px]">
                    {item.control}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-[11px]">
                    {item.whatItControls}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        title="Editar riesgo"
                        aria-label={`Editar ${item.risk}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRisk(item.id)}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                        title="Eliminar riesgo"
                        aria-label={`Eliminar ${item.risk}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

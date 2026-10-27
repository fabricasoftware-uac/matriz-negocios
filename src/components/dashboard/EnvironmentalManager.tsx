"use client";

import React, { useState } from "react";
import { Plus, Trash2, Leaf, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { ConesaCategory } from "@/lib/financial-engine";

export function EnvironmentalManager() {
  const { conesaImpacts, updateConesaImpact, addConesaImpact, removeConesaImpact, conesaSummary } =
    useProject();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newComponent, setNewComponent] = useState("Socioeconómico");
  const [newElement, setNewElement] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newSpecific, setNewSpecific] = useState("");
  const [newSign, setNewSign] = useState<"+" | "-">("+");

  const getCategoryBadgeColor = (cat: ConesaCategory) => {
    switch (cat) {
      case "Irrelevante":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
      case "Moderado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "Severo":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
      case "Crítico":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElement.trim() || !newSpecific.trim()) return;

    addConesaImpact({
      component: newComponent,
      element: newElement.trim(),
      item: newItem.trim() || newElement.trim(),
      specificImpact: newSpecific.trim(),
      sign: newSign,
      intensity: 2,
      extension: 2,
      moment: 2,
      persistence: 2,
      reversibility: 2,
      recoverability: 2,
      effect: 2,
      periodicity: 2,
    });

    setNewElement("");
    setNewItem("");
    setNewSpecific("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Estudio de Sostenibilidad & ESG
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            Matriz de Impacto Ambiental & Social (Vicente Conesa)
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Cuantificación algorítmica de la Importancia del Impacto (I) según 8 criterios metodológicos: Intensidad, Extensión, Momento, Persistencia, Reversibilidad, Recuperabilidad, Efecto y Periodicidad.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Importancia Promedio
            </span>
            <span className="text-xl font-extrabold text-foreground font-mono">
              {conesaSummary.averageImportance.toFixed(1)} pts
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Impacto</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Conesa */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
            Total Impactos
          </span>
          <span className="text-2xl font-bold text-foreground mt-1 block">
            {conesaSummary.totalImpacts}
          </span>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
              Beneficiosos (+)
            </span>
            <ThumbsUp className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {conesaSummary.beneficialCount}
          </span>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase">
              Adversos (-)
            </span>
            <ThumbsDown className="h-4 w-4 text-rose-600" />
          </div>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {conesaSummary.adverseCount}
          </span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
            Categorización
          </span>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold">
              {conesaSummary.categoryCounts.Irrelevante} Irrelevante
            </span>
            <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {conesaSummary.categoryCounts.Moderado} Moderado
            </span>
          </div>
        </div>
      </div>

      {/* Micro-guía explicativa */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">Ecuación de Vicente Conesa: I = ± [ 3(U) + 2(EX) + MO + PE + RV + MC + EF + PR ]</span>
            <p className="mt-0.5 text-emerald-800/90 dark:text-emerald-300/90">
              Los impactos menores a 25 puntos son <strong>Irrelevantes</strong>; de 25 a 50 son <strong>Moderados</strong>; de 50 a 75 son <strong>Severos</strong>; y mayores a 75 son <strong>Críticos</strong>. Esta metodología permite justificar la viabilidad socioambiental del proyecto ante inversionistas y autoridades regulatorias.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Impactos */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs text-foreground" aria-label="Tabla de Matriz Ambiental Conesa">
          <thead className="bg-muted/70 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
            <tr>
              <th scope="col" className="px-4 py-3 min-w-[140px]">Componente & Elemento</th>
              <th scope="col" className="px-4 py-3 min-w-[200px]">Impacto Específico</th>
              <th scope="col" className="px-3 py-3 text-center">Signo</th>
              <th scope="col" className="px-3 py-3 text-center">Intensidad (U)</th>
              <th scope="col" className="px-3 py-3 text-center">Extensión (EX)</th>
              <th scope="col" className="px-4 py-3 text-right">Importancia (I)</th>
              <th scope="col" className="px-3 py-3 text-center">Categoría</th>
              <th scope="col" className="px-3 py-3 text-center w-12">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {conesaSummary.impacts.map((res, idx) => {
              const item = res.input;
              return (
                <tr key={item.id || idx} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground block">{item.element}</span>
                    <span className="text-[10px] text-muted-foreground">{item.component}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.specificImpact}
                      onChange={(e) => updateConesaImpact(idx, { specificImpact: e.target.value })}
                      className="w-full bg-transparent border-b border-dashed border-border text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => updateConesaImpact(idx, { sign: item.sign === "+" ? "-" : "+" })}
                      className={`h-7 w-7 rounded-md font-bold text-sm cursor-pointer ${
                        item.sign === "+"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                      }`}
                      aria-label={`Cambiar signo de ${item.element}`}
                    >
                      {item.sign}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <select
                      value={item.intensity}
                      onChange={(e) => updateConesaImpact(idx, { intensity: Number(e.target.value) })}
                      className="rounded-md border border-border bg-muted/40 px-1 py-1 text-xs"
                    >
                      <option value={1}>1 (Baja)</option>
                      <option value={2}>2 (Media-baja)</option>
                      <option value={4}>4 (Media)</option>
                      <option value={8}>8 (Alta)</option>
                      <option value={12}>12 (Muy alta)</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <select
                      value={item.extension}
                      onChange={(e) => updateConesaImpact(idx, { extension: Number(e.target.value) })}
                      className="rounded-md border border-border bg-muted/40 px-1 py-1 text-xs"
                    >
                      <option value={1}>1 (Puntual)</option>
                      <option value={2}>2 (Parcial)</option>
                      <option value={4}>4 (Extenso)</option>
                      <option value={8}>8 (Total)</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-sm">
                    <span className={res.isBeneficial ? "text-emerald-600" : "text-rose-600"}>
                      {res.signedImportance > 0 ? `+${res.signedImportance}` : res.signedImportance}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${getCategoryBadgeColor(
                        res.category
                      )}`}
                    >
                      {res.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {conesaImpacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConesaImpact(idx)}
                        className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        aria-label={`Eliminar impacto ${item.element}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Impacto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Registrar Nuevo Impacto Conesa</h4>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Componente Ambiental / Social
                </label>
                <select
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="Socioeconómico">Socioeconómico & Laboral</option>
                  <option value="Medio Físico">Medio Físico (Energía / Residuos)</option>
                  <option value="Medio Biótico">Medio Biótico (Flora / Fauna)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Elemento Afectado
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Emisiones de CO2 por servidores"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Impacto Específico
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mitigación mediante hosting verde"
                  value={newSpecific}
                  onChange={(e) => setNewSpecific(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Signo o Carácter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSign("+")}
                    className={`rounded-xl border p-2 text-xs font-bold ${
                      newSign === "+"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    (+) Beneficioso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSign("-")}
                    className={`rounded-xl border p-2 text-xs font-bold ${
                      newSign === "-"
                        ? "border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    (-) Adverso
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Guardar Impacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

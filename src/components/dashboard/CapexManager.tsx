"use client";

import React, { useState } from "react";
import { Plus, Trash2, HelpCircle, HardDrive } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function CapexManager() {
  const { capexItems, updateCapex, addCapex, removeCapex } = useProject();
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState(3000000);
  const [newLife, setNewLife] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalCapex = capexItems.reduce((acc, item) => acc + item.cost, 0);
  const totalAnnualDepreciation = capexItems.reduce(
    (acc, item) => acc + (item.usefulLifeYears > 0 ? item.cost / item.usefulLifeYears : 0),
    0
  );

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCapex({
      name: newName.trim(),
      unit: "$",
      cost: Number(newCost) || 0,
      usefulLifeYears: Number(newLife) || 5,
    });
    setNewName("");
    setNewCost(3000000);
    setNewLife(5);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Estudio Técnico de Activos
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Presupuesto de Inversión (CAPEX) & Depreciación
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Activos físicos y plataformas digitales requeridas antes de la operación (Año 0). El gasto de depreciación reduce la base gravable de renta en el P&G.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Inversión Total en Activos
            </span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {formatCOP(totalCapex)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Activo</span>
          </button>
        </div>
      </div>

      {/* Micro-guía explicativa */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">¿Qué es el CAPEX y cómo funciona la depreciación?</span>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/90">
              El CAPEX (Capital Expenditures) es la salida de efectivo inicial para adquirir maquinaria, muebles, tecnología o software. Estos activos pierden valor contable cada año (depreciación en línea recta). Aunque la depreciación no es una salida de dinero en los años operativos, es un gasto fiscal deducible que genera un escudo tributario.
            </p>
          </div>
        </div>
      </div>

      {/* Listado de Activos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {capexItems.map((item, idx) => {
          const annualDep = item.usefulLifeYears > 0 ? item.cost / item.usefulLifeYears : 0;
          return (
            <div
              key={item.id || idx}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <HardDrive className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateCapex(idx, { name: e.target.value })}
                        className="font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none w-full"
                        aria-label={`Nombre del activo ${idx + 1}`}
                      />
                      <span className="text-[10px] text-muted-foreground block">
                        Depreciación en {item.usefulLifeYears} años
                      </span>
                    </div>
                  </div>

                  {capexItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCapex(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Edición de Costo */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Costo de Adquisición (COP)
                    </label>
                    <input
                      type="number"
                      step={100000}
                      min={0}
                      value={item.cost}
                      onChange={(e) =>
                        updateCapex(idx, { cost: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-full rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-sm font-mono font-bold text-foreground focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Vida Útil (Años)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={item.usefulLifeYears}
                        onChange={(e) =>
                          updateCapex(idx, { usefulLifeYears: Number(e.target.value) })
                        }
                        className="flex-1 accent-blue-600 cursor-pointer"
                      />
                      <span className="w-12 text-center text-xs font-mono font-bold rounded-md bg-muted py-1 border border-border">
                        {item.usefulLifeYears} a
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Depreciación calculada */}
              <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Deprec. Anual:</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {formatCOP(annualDep)} / año
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen Total de Depreciación */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">
          Depreciación anual total consolidada en P&G (Años 1 al 5):
        </span>
        <span className="font-mono font-bold text-sm text-foreground">
          {formatCOP(totalAnnualDepreciation)} / año
        </span>
      </div>

      {/* Modal para Agregar Activo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Agregar Nuevo Activo / CAPEX</h4>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nombre o Descripción del Activo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Servidor Local o Licencia ERP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Costo Total ($)
                  </label>
                  <input
                    type="number"
                    step={100000}
                    min={0}
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Vida Útil (Años)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={newLife}
                    onChange={(e) => setNewLife(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                  />
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
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Guardar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Trash2, ShoppingBag, Building2 } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function OpexManager() {
  const {
    directSupplies,
    updateDirectSupply,
    addDirectSupply,
    removeDirectSupply,
    operatingExpenses,
    updateOperatingExpense,
    addOperatingExpense,
    removeOperatingExpense,
  } = useProject();

  const [newSupplyName, setNewSupplyName] = useState("");
  const [newSupplyMonthly, setNewSupplyMonthly] = useState(500000);
  const [showSupplyModal, setShowSupplyModal] = useState(false);

  const [newOpexName, setNewOpexName] = useState("");
  const [newOpexMonthly, setNewOpexMonthly] = useState(500000);
  const [showOpexModal, setShowOpexModal] = useState(false);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalSuppliesAnnual = directSupplies.reduce(
    (sum, item) => sum + item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12),
    0
  );

  const totalOpexAnnual = operatingExpenses.reduce(
    (sum, item) => sum + item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12),
    0
  );

  return (
    <div className="space-y-8">
      {/* Sección 1: Insumos Directos & Materias Primas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Costos Directos
            </span>
            <h3 className="text-lg font-bold text-foreground mt-0.5 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              Insumos y Materiales Directos
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Costos variables vinculados directamente con la prestación o distribución del servicio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Total Insumos (Año)
              </span>
              <span className="text-lg font-extrabold text-foreground font-mono">
                {formatCOP(totalSuppliesAnnual)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSupplyModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Insumo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {directSupplies.map((item, idx) => {
            const annualCost = item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12);
            return (
              <div key={item.id || idx} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateDirectSupply(idx, { name: e.target.value })}
                    className="font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none"
                    aria-label={`Nombre de insumo ${idx + 1}`}
                  />
                  {directSupplies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDirectSupply(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateDirectSupply(idx, { quantity: Number(e.target.value) || 1 })
                      }
                      className="w-full rounded-lg border border-border bg-muted/40 px-2 py-1 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Valor Unitario ($)</label>
                    <input
                      type="number"
                      step={50000}
                      value={item.monthlyValue}
                      onChange={(e) =>
                        updateDirectSupply(idx, { monthlyValue: Number(e.target.value) || 0 })
                      }
                      className="w-full rounded-lg border border-border bg-muted/40 px-2 py-1 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="mt-3 border-t border-border pt-2 flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Costo Anual:</span>
                  <span className="font-mono text-foreground">{formatCOP(annualCost)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección 2: Gastos Operacionales (OPEX) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Gastos Administrativos & Generales
            </span>
            <h3 className="text-lg font-bold text-foreground mt-0.5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Gastos Operacionales (OPEX)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Arrendamiento, servicios públicos, suscripciones y conectividad indispensables para operar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Total OPEX (Año)
              </span>
              <span className="text-lg font-extrabold text-foreground font-mono">
                {formatCOP(totalOpexAnnual)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowOpexModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Gasto</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operatingExpenses.map((item, idx) => {
            const annualCost = item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12);
            return (
              <div key={item.id || idx} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateOperatingExpense(idx, { name: e.target.value })}
                    className="font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border focus:border-purple-500 focus:outline-none"
                    aria-label={`Nombre del gasto ${idx + 1}`}
                  />
                  {operatingExpenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOperatingExpense(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Cantidad / Meses</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateOperatingExpense(idx, { quantity: Number(e.target.value) || 1 })
                      }
                      className="w-full rounded-lg border border-border bg-muted/40 px-2 py-1 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Valor Mensual ($)</label>
                    <input
                      type="number"
                      step={50000}
                      value={item.monthlyValue}
                      onChange={(e) =>
                        updateOperatingExpense(idx, { monthlyValue: Number(e.target.value) || 0 })
                      }
                      className="w-full rounded-lg border border-border bg-muted/40 px-2 py-1 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="mt-3 border-t border-border pt-2 flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Costo Anual:</span>
                  <span className="font-mono text-foreground">{formatCOP(annualCost)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para Agregar Insumo */}
      {showSupplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Agregar Insumo o Materia Prima</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSupplyName.trim()) return;
                addDirectSupply({
                  name: newSupplyName.trim(),
                  quantity: 1,
                  monthlyValue: Number(newSupplyMonthly) || 0,
                  annualMultiplier: 12,
                });
                setNewSupplyName("");
                setShowSupplyModal(false);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nombre del Insumo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Material de empaque / Software de procesamiento"
                  value={newSupplyName}
                  onChange={(e) => setNewSupplyName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Valor Mensual ($)
                </label>
                <input
                  type="number"
                  step={50000}
                  required
                  value={newSupplyMonthly}
                  onChange={(e) => setNewSupplyMonthly(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSupplyModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Agregar OPEX */}
      {showOpexModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Agregar Gasto Operacional (OPEX)</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newOpexName.trim()) return;
                addOperatingExpense({
                  name: newOpexName.trim(),
                  quantity: 1,
                  monthlyValue: Number(newOpexMonthly) || 0,
                  annualMultiplier: 12,
                });
                setNewOpexName("");
                setShowOpexModal(false);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nombre del Gasto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Licencias Contables / Publicidad Digital"
                  value={newOpexName}
                  onChange={(e) => setNewOpexName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Valor Mensual ($)
                </label>
                <input
                  type="number"
                  step={50000}
                  required
                  value={newOpexMonthly}
                  onChange={(e) => setNewOpexMonthly(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOpexModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

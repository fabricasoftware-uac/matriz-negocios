"use client";

import React, { useState } from "react";
import { Plus, Trash2, HelpCircle, Briefcase } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { calculatePayrollSummary, DEFAULT_PAYROLL_CONFIG } from "@/lib/financial-engine/payroll";

export function PayrollManager() {
  const { positions, updatePosition, addPosition, removePosition } = useProject();
  const [newRole, setNewRole] = useState("");
  const [newHeadcount, setNewHeadcount] = useState(1);
  const [newSalary, setNewSalary] = useState(DEFAULT_PAYROLL_CONFIG.smlmv);
  const [showAddModal, setShowAddModal] = useState(false);

  const summary = calculatePayrollSummary(positions, DEFAULT_PAYROLL_CONFIG);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    addPosition({
      role: newRole.trim(),
      headcount: Number(newHeadcount) || 1,
      monthlyBaseSalary: Number(newSalary) || DEFAULT_PAYROLL_CONFIG.smlmv,
    });
    setNewRole("");
    setNewHeadcount(1);
    setNewSalary(DEFAULT_PAYROLL_CONFIG.smlmv);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Estudio Organizacional
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Nómina Colombiana & Prestaciones Sociales
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Cálculo automatizado con factor prestacional de ley: Auxilio de Transporte ($140.606), Prima, Cesantías, Intereses de Cesantías (12%) y Vacaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Costo Anual Total
            </span>
            <span className="text-xl font-extrabold text-foreground font-mono">
              {formatCOP(summary.totalAnnualCost)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Cargo</span>
          </button>
        </div>
      </div>

      {/* Micro-guía explicativa */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">Estructura Prestacional en Colombia</span>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/90">
              El costo de un trabajador no es solo su salario base. Por ley, el empleador asume auxilio de transporte para salarios de hasta 2 SMLMV, prima semestral (30 días), cesantías anuales (30 días), intereses sobre cesantías (12% anual) y provisión de vacaciones (15 días hábiles / 30 días base).
            </p>
          </div>
        </div>
      </div>

      {/* Tabla detallada de cargos */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs text-foreground" aria-label="Desglose de nómina por cargo">
          <thead className="bg-muted/70 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
            <tr>
              <th scope="col" className="px-4 py-3 min-w-[160px]">Cargo / Rol</th>
              <th scope="col" className="px-3 py-3 text-center w-24">Personas</th>
              <th scope="col" className="px-4 py-3 text-right">Salario Base</th>
              <th scope="col" className="px-3 py-3 text-right">Aux. Transp.</th>
              <th scope="col" className="px-3 py-3 text-right">Prima</th>
              <th scope="col" className="px-3 py-3 text-right">Cesantías</th>
              <th scope="col" className="px-3 py-3 text-right">Int. Cesantías</th>
              <th scope="col" className="px-3 py-3 text-right">Vacaciones</th>
              <th scope="col" className="px-4 py-3 text-right">Costo / Persona</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Total Mensual</th>
              <th scope="col" className="px-3 py-3 text-center w-12">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {summary.positions.map((item, idx) => (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500 shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => updatePosition(idx, { role: e.target.value })}
                      className="font-semibold text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none w-full"
                      aria-label={`Nombre del cargo ${idx + 1}`}
                    />
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={item.headcount}
                    onChange={(e) =>
                      updatePosition(idx, { headcount: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-14 rounded-lg border border-border bg-muted/40 px-1 py-1 text-center font-mono font-bold"
                    aria-label={`Cantidad de personas para ${item.role}`}
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  <input
                    type="number"
                    step={50000}
                    value={item.baseSalary}
                    onChange={(e) =>
                      updatePosition(idx, {
                        monthlyBaseSalary: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-28 rounded-lg border border-border bg-muted/40 px-2 py-1 text-right font-mono font-bold"
                    aria-label={`Salario base de ${item.role}`}
                  />
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                  {formatCOP(item.auxilioTransporte)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                  {formatCOP(item.prima)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                  {formatCOP(item.cesantias)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                  {formatCOP(item.interesesCesantias)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                  {formatCOP(item.vacaciones)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {formatCOP(item.totalMonthlyCostPerPerson)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                  {formatCOP(item.totalMonthlyCost)}
                </td>
                <td className="px-3 py-3 text-center">
                  {positions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePosition(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      aria-label={`Eliminar cargo ${item.role}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-border bg-muted/40 font-bold">
            <tr>
              <th scope="row" className="px-4 py-3" colSpan={8}>
                TOTALES MENSUALES CONSOLIDADOS
              </th>
              <td className="px-4 py-3 text-right font-mono text-muted-foreground">Mensual:</td>
              <td className="px-4 py-3 text-right font-mono text-base font-extrabold text-foreground">
                {formatCOP(summary.totalMonthlyCost)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal para Agregar Cargo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Agregar Nuevo Cargo a la Planta</h4>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Título del Cargo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Desarrollador Senior / Diseñador UX"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Número de Personas
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newHeadcount}
                    onChange={(e) => setNewHeadcount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Salario Base Mensual (COP)
                  </label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
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
                  Guardar Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

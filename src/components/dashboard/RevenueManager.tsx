"use client";

import React, { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function RevenueManager() {
  const { revenues, updateRevenue, addRevenue, removeRevenue, engineOutput } = useProject();
  const [newRevenueName, setNewRevenueName] = useState("");
  const [newRevenueQty, setNewRevenueQty] = useState(10);
  const [newRevenuePrice, setNewRevenuePrice] = useState(500000);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalRevenueYear0 = engineOutput.incomeStatement[0]?.revenues ?? 0;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevenueName.trim()) return;
    addRevenue({
      name: newRevenueName.trim(),
      quantity: Number(newRevenueQty) || 1,
      unitPrice: Number(newRevenuePrice) || 0,
    });
    setNewRevenueName("");
    setNewRevenueQty(10);
    setNewRevenuePrice(500000);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Estudio de Mercado & Portafolio
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Ingresos Proyectados y Estrategia de Precios
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Ajusta los volúmenes de venta y tarifas por servicio. Las variaciones impactan instantáneamente el Flujo de Caja Libre, la TIR y el VPN.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Ingresos Totales (Año 0)
            </span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCOP(totalRevenueYear0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Servicio</span>
          </button>
        </div>
      </div>

      {/* Micro-guía explicativa para no financieros */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">¿Cómo se calcula el ingreso anual?</span>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/90">
              Cada ítem multiplica su cantidad proyectada por su precio unitario. En el modelo de Jorge Orozco, los canones anuales de mantenimiento representan el flujo de caja recurrente más robusto del negocio.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de productos / servicios con sliders */}
      <div className="grid grid-cols-1 gap-4">
        {revenues.map((item, idx) => {
          const itemTotal = item.quantity * item.unitPrice;
          return (
            <div
              key={item.id || idx}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs dark:bg-blue-950 dark:text-blue-300">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateRevenue(idx, { name: e.target.value })}
                    className="font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none px-1"
                    aria-label={`Nombre del servicio ${idx + 1}`}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Subtotal Proyectado
                    </span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCOP(itemTotal)}
                    </span>
                  </div>

                  {revenues.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRevenue(idx)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sliders y Controles de Cantidad y Precio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cantidad */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor={`rev-qty-${idx}`} className="font-semibold text-muted-foreground">
                      Cantidad Proyectada (Unidades / Clientes)
                    </label>
                    <input
                      id={`rev-qty-${idx}`}
                      type="number"
                      min={1}
                      max={500}
                      value={item.quantity}
                      onChange={(e) =>
                        updateRevenue(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="w-20 rounded-lg border border-border bg-muted/40 px-2 py-1 text-right text-xs font-bold font-mono"
                    />
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={item.quantity}
                    onChange={(e) => updateRevenue(idx, { quantity: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                    aria-label={`Slider de cantidad para ${item.name}`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>1 u</span>
                    <span>50 u</span>
                    <span>100 u</span>
                  </div>
                </div>

                {/* Precio Unitario */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor={`rev-price-${idx}`} className="font-semibold text-muted-foreground">
                      Precio Unitario (COP)
                    </label>
                    <input
                      id={`rev-price-${idx}`}
                      type="number"
                      step={10000}
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateRevenue(idx, { unitPrice: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-32 rounded-lg border border-border bg-muted/40 px-2 py-1 text-right text-xs font-bold font-mono"
                    />
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={50000}
                    value={item.unitPrice}
                    onChange={(e) => updateRevenue(idx, { unitPrice: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                    aria-label={`Slider de precio para ${item.name}`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>$100.000</span>
                    <span>$5.000.000</span>
                    <span>$10.000.000</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Agregar Servicio */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">Agregar Nuevo Concepto de Ingreso</h4>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nombre del Producto o Servicio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Licenciamiento Anual Premium"
                  value={newRevenueName}
                  onChange={(e) => setNewRevenueName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Cantidad (Unidades)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newRevenueQty}
                    onChange={(e) => setNewRevenueQty(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Precio Unitario ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    required
                    value={newRevenuePrice}
                    onChange={(e) => setNewRevenuePrice(Number(e.target.value))}
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
                  Guardar Concepto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

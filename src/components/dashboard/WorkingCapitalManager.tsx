"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function WorkingCapitalManager() {
  const { workingCapitalDays, setWorkingCapitalDays, engineOutput } = useProject();
  const wcYear0 = engineOutput.workingCapital[0];

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Gestión Operativa de Liquidez
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Capital de Trabajo Neto Operativo (KTNO)
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Simula las políticas de crédito comercial, rotación de inventarios y financiación de proveedores. Los días de cartera retienen liquidez en el proyecto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              KTNO Requerido (Año 0)
            </span>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {formatCOP(wcYear0?.ktno ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Micro-guía explicativa */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">Fórmula Maestra del KTNO: CxC + Inventarios - CxP</span>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/90">
              Cuando vendes a crédito a 60 días, tus clientes tardan 2 meses en pagarte. Si tus proveedores te dan 60 días de plazo, ellos financian parte de tu operación. Cuanto más altos sean los días de cobro y de inventario respecto a los días de pago a proveedores, más caja de inversión inicial (Año 0) deberás inyectar al negocio.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Sliders de Días de Rotación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Días de Cartera (CxC) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-foreground block">
                Días de Cuentas por Cobrar (CxC)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Plazo otorgado a los clientes
              </span>
            </div>
            <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-mono font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {workingCapitalDays.cxcDays} días
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={workingCapitalDays.cxcDays}
            onChange={(e) =>
              setWorkingCapitalDays((prev) => ({ ...prev, cxcDays: Number(e.target.value) }))
            }
            className="w-full accent-blue-600 cursor-pointer"
            aria-label="Slider de días de cuentas por cobrar"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>Contado (0d)</span>
            <span>60d (Benchmark)</span>
            <span>180d</span>
          </div>

          <div className="border-t border-border pt-3 text-xs flex justify-between">
            <span className="text-muted-foreground">CxC Año 0:</span>
            <span className="font-mono font-bold text-foreground">
              {formatCOP(wcYear0?.cxc ?? 0)}
            </span>
          </div>
        </div>

        {/* Slider 2: Días de Inventario */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-foreground block">
                Días de Inventario / Insumos
              </span>
              <span className="text-[11px] text-muted-foreground">
                Stock y servicios en proceso
              </span>
            </div>
            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-mono font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {workingCapitalDays.inventoryDays} días
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={workingCapitalDays.inventoryDays}
            onChange={(e) =>
              setWorkingCapitalDays((prev) => ({ ...prev, inventoryDays: Number(e.target.value) }))
            }
            className="w-full accent-emerald-600 cursor-pointer"
            aria-label="Slider de días de inventarios"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0d</span>
            <span>90d (Benchmark)</span>
            <span>180d</span>
          </div>

          <div className="border-t border-border pt-3 text-xs flex justify-between">
            <span className="text-muted-foreground">Inventarios Año 0:</span>
            <span className="font-mono font-bold text-foreground">
              {formatCOP(wcYear0?.inventories ?? 0)}
            </span>
          </div>
        </div>

        {/* Slider 3: Días de Cuentas por Pagar (CxP) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-foreground block">
                Días de Cuentas por Pagar (CxP)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Plazo otorgado por proveedores
              </span>
            </div>
            <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-mono font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              {workingCapitalDays.cxpDays} días
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={workingCapitalDays.cxpDays}
            onChange={(e) =>
              setWorkingCapitalDays((prev) => ({ ...prev, cxpDays: Number(e.target.value) }))
            }
            className="w-full accent-purple-600 cursor-pointer"
            aria-label="Slider de días de cuentas por pagar"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0d</span>
            <span>60d (Benchmark)</span>
            <span>180d</span>
          </div>

          <div className="border-t border-border pt-3 text-xs flex justify-between">
            <span className="text-muted-foreground">CxP Financiado Año 0:</span>
            <span className="font-mono font-bold text-foreground">
              -{formatCOP(wcYear0?.cxp ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Resumen de Ecuación de Capital de Trabajo */}
      <div className="rounded-2xl border border-border bg-muted/20 p-5">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
          Ecuación Financiera de Liquidez Año 0
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-xl border border-border bg-card p-3">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              (+) Cartera (CxC)
            </span>
            <span className="text-sm font-bold font-mono text-foreground mt-1 block">
              {formatCOP(wcYear0?.cxc ?? 0)}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              (+) Inventarios
            </span>
            <span className="text-sm font-bold font-mono text-foreground mt-1 block">
              {formatCOP(wcYear0?.inventories ?? 0)}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              (-) Proveedores (CxP)
            </span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
              -{formatCOP(wcYear0?.cxp ?? 0)}
            </span>
          </div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40 p-3">
            <span className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-bold block">
              (=) KTNO Año 0
            </span>
            <span className="text-sm font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-1 block">
              {formatCOP(wcYear0?.ktno ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

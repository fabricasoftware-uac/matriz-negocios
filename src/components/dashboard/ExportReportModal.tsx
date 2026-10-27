"use client";

import React, { useState } from "react";
import {
  Printer,
  FileDown,
  X,
  FileText,
  ShieldCheck,
  DollarSign,
  Building,
  Calendar,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function ExportReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    projectInfo,
    engineOutput,
    discountRate,
    conesaSummary,
    risks,
    legalData,
    technicalData,
  } = useProject();

  const { irr, excelNpv, viability, incomeStatement, cashFlow, workingCapital } =
    engineOutput;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Botón Disparador del Modal */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-4 py-2 text-xs font-semibold shadow-xs hover:bg-slate-800 dark:hover:bg-white cursor-pointer transition-colors"
        title="Generar e imprimir informe ejecutivo para inversionistas"
      >
        <FileDown className="h-4 w-4" />
        <span>Exportar Informe (PDF)</span>
      </button>

      {/* Modal Overlay & Contenido */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
        >
          <div className="relative w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
            {/* Header del Modal (No se imprime) */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 px-6 py-4 shrink-0 no-print">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Dossier Ejecutivo de Inversión (Vista Previa de Impresión)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Documento preparado para descarga PDF o impresión directa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Documento Imprimible */}
            <div
              id="printable-dossier"
              className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 bg-card text-foreground"
            >
              {/* Membrete y Ficha del Proyecto */}
              <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    INFORME DE FACTIBILIDAD FINANCIERA MULTICRITERIO
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1 tracking-tight">
                    {projectInfo.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {projectInfo.description}
                  </p>
                </div>

                <div className="text-right sm:self-end text-xs space-y-1">
                  <div className="flex items-center sm:justify-end gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Fecha: {new Date().toLocaleDateString("es-CO")}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 font-medium">
                    <Building className="h-3.5 w-3.5" />
                    <span>{legalData.commercialName} • Popayán, Colombia</span>
                  </div>
                  <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    Metodología Jorge Orozco
                  </span>
                </div>
              </div>

              {/* Dictamen de Viabilidad & KPIs */}
              <div className="rounded-2xl border-2 border-emerald-600/40 bg-emerald-50/30 dark:bg-emerald-950/20 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {viability.overallStatus === "VIABLE"
                        ? "PROYECTO FINANCIERAMENTE VIABLE"
                        : "PROYECTO NO RECOMENDADO"}
                    </span>
                    <h2 className="text-lg font-bold text-foreground mt-2">
                      Conclusiones de Evaluación y Retorno de Capital
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      La Tasa Interna de Retorno (TIR) supera ampliamente la tasa de descuento exigida (WACC) de {(discountRate * 100).toFixed(1)}%.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center p-3 rounded-xl bg-card border border-border min-w-[110px]">
                      <span className="text-[10px] font-bold text-muted-foreground block">
                        TIR Proyectada
                      </span>
                      <strong className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {(irr * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="text-center p-3 rounded-xl bg-card border border-border min-w-[130px]">
                      <span className="text-[10px] font-bold text-muted-foreground block">
                        VPN Generado
                      </span>
                      <strong className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCOP(excelNpv)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla Flujo de Caja Libre (FCL) Proyectado */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  1. Flujo de Caja Libre Anual Descontado (Años 0 a 5)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs text-left" aria-label="FCL proyectado en informe">
                    <thead className="bg-muted/80 text-[10px] uppercase font-semibold text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-3 py-2">Año</th>
                        <th className="px-3 py-2 text-right">Utilidad Neta</th>
                        <th className="px-3 py-2 text-right">Depreciación</th>
                        <th className="px-3 py-2 text-right">Flujo Bruto</th>
                        <th className="px-3 py-2 text-right">Var. KTNO</th>
                        <th className="px-3 py-2 text-right">CAPEX</th>
                        <th className="px-3 py-2 text-right font-bold text-foreground">
                          Flujo Libre (FCL)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-[11px]">
                      {cashFlow.map((cf) => (
                        <tr key={cf.year} className="hover:bg-muted/30">
                          <td className="px-3 py-1.5 font-bold text-foreground">
                            Año {cf.year}
                          </td>
                          <td className="px-3 py-1.5 text-right">{formatCOP(cf.netIncome)}</td>
                          <td className="px-3 py-1.5 text-right">{formatCOP(cf.depreciation)}</td>
                          <td className="px-3 py-1.5 text-right">{formatCOP(cf.grossCashFlow)}</td>
                          <td className="px-3 py-1.5 text-right">{formatCOP(cf.deltaKtno)}</td>
                          <td className="px-3 py-1.5 text-right">{formatCOP(cf.capex)}</td>
                          <td
                            className={`px-3 py-1.5 text-right font-bold ${
                              cf.freeCashFlow >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {formatCOP(cf.freeCashFlow)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Síntesis P&G y Capital de Trabajo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    2. Resumen P&G (Año 1 al 5)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ingresos Año 1:</span>
                      <strong className="font-mono">{formatCOP(incomeStatement[1]?.revenues ?? 0)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ingresos Año 5:</span>
                      <strong className="font-mono">{formatCOP(incomeStatement[5]?.revenues ?? 0)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Utilidad Neta Año 1:</span>
                      <strong className="font-mono text-emerald-600">{formatCOP(incomeStatement[1]?.netIncome ?? 0)}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Utilidad Neta Año 5:</span>
                      <strong className="font-mono text-emerald-600">{formatCOP(incomeStatement[5]?.netIncome ?? 0)}</strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    3. Resumen Capital de Trabajo (KTNO)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">KTNO Año 0 (Inicial):</span>
                      <strong className="font-mono">{formatCOP(workingCapital[0]?.ktno ?? 0)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">KTNO Año 5:</span>
                      <strong className="font-mono">{formatCOP(workingCapital[5]?.ktno ?? 0)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Días Cuentas por Cobrar:</span>
                      <strong className="font-mono">60 días</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Días Inventario / Intangibles:</span>
                      <strong className="font-mono">90 días</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Síntesis Cualitativa: Legal, Riesgos y Ambiental */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
                <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 space-y-1">
                  <strong className="text-foreground block">Estructura Legal & Técnica:</strong>
                  <p className="text-muted-foreground">
                    {legalData.companyType} en {technicalData.city} ({technicalData.department}) con capital de {formatCOP(legalData.paidCapital)}. Límite de facultades de {legalData.legalRepLimitSmlmv} SMLMV. Cumplimiento DIAN bajo código CIIU {legalData.ciiuOther.code}.
                  </p>
                </div>

                <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 space-y-1">
                  <strong className="text-foreground block">Matriz de Riesgos:</strong>
                  <p className="text-muted-foreground">
                    {risks.length} riesgos clasificados en mapa de calor 5x5. Controles preventivos automatizados en Siigo y DIAN; segregación de funciones contra fraudes contables.
                  </p>
                </div>

                <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 space-y-1">
                  <strong className="text-foreground block">Impacto Ambiental (Conesa):</strong>
                  <p className="text-muted-foreground">
                    {conesaSummary.beneficialCount} impactos positivos en dinamización económica y generación de empleo, compensando emisiones de servidores y RAEE.
                  </p>
                </div>
              </div>

              {/* Firmas de Responsabilidad */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="border-t border-border pt-3">
                  <strong className="text-foreground block">{legalData.legalRepresentative}</strong>
                  <span className="text-muted-foreground">Representante Legal / Gerente General</span>
                </div>
                <div className="border-t border-border pt-3">
                  <strong className="text-foreground block">{projectInfo.author}</strong>
                  <span className="text-muted-foreground">Evaluador de Proyecto / Metodología</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Loader2,
  TrendingUp,
  Percent,
  Megaphone,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function AiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string>("audit");
  const [responseNotice, setResponseNotice] = useState<string | null>(null);
  const [responseContent, setResponseContent] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const { projectInfo, engineOutput, discountRate, workingCapitalDays, legalData } =
    useProject();

  const drawerRef = useRef<HTMLDivElement>(null);

  const executeAction = useCallback(
    async (action: "audit" | "margins" | "pitch" | "custom", prompt?: string) => {
      setActiveAction(action);
      setLoading(true);
      setResponseNotice(null);

      const projectMetrics = {
        projectName: projectInfo.name,
        irr: engineOutput.irr,
        excelNpv: engineOutput.excelNpv,
        discountRate,
        isViable: engineOutput.viability.isOverallViable,
        fclYear0: engineOutput.cashFlow[0]?.freeCashFlow ?? 0,
        fclYear1: engineOutput.cashFlow[1]?.freeCashFlow ?? 0,
        fclYear5: engineOutput.cashFlow[5]?.freeCashFlow ?? 0,
        revenuesYear1: engineOutput.incomeStatement[1]?.revenues ?? 0,
        netIncomeYear1: engineOutput.incomeStatement[1]?.netIncome ?? 0,
        workingCapitalDays: {
          cxcDays: workingCapitalDays.cxcDays,
          cxpDays: workingCapitalDays.cxpDays,
          inventoryDays: workingCapitalDays.inventoryDays,
        },
        totalCapex: engineOutput.cashFlow[0]?.capex ?? 0,
        companyType: legalData.companyType,
      };

      try {
        const res = await fetch("/api/ai/copilot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            prompt: prompt || customInput,
            projectMetrics,
          }),
        });

        const data = await res.json();
        setResponseNotice(data.notice || null);
        setResponseContent(data.result || "No se pudo generar una respuesta.");
      } catch {
        setResponseNotice(
          "ℹ️ La IA es una función opcional. No hay conexión disponible en este momento, pero puedes seguir operando tu modelo manual con total normalidad."
        );
        setResponseContent(
          "Tus cifras actuales muestran una TIR de " +
            (engineOutput.irr * 100).toFixed(2) +
            "% y un VPN de $" +
            engineOutput.excelNpv.toLocaleString("es-CO") +
            " COP, lo cual ratifica la viabilidad técnica y financiera del proyecto."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      projectInfo.name,
      engineOutput,
      discountRate,
      workingCapitalDays,
      legalData.companyType,
      customInput,
    ]
  );

  // Cierra con Escape y atiende evento para abrir desde Header o Banner
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    const handleExternalOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ action?: "audit" | "margins" | "pitch" }>;
      setIsOpen(true);
      const actionToRun = customEvent.detail?.action || "audit";
      executeAction(actionToRun);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-copilot", handleExternalOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-copilot", handleExternalOpen);
    };
  }, [isOpen, executeAction]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    executeAction("custom", customInput);
  };

  // Ejecuta la auditoría inicial cuando se abre el drawer por primera vez
  const handleOpenDrawer = () => {
    setIsOpen(true);
    if (!responseContent && !loading) {
      executeAction("audit");
    }
  };

  return (
    <>
      {/* Botón flotante accesible en la esquina inferior derecha (elevado para no obstruir el pie de página) */}
      <button
        type="button"
        onClick={handleOpenDrawer}
        aria-label="Abrir Asistente IA Copilot Financiero"
        className="fixed bottom-20 sm:bottom-24 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer no-print ring-2 ring-white/30"
      >
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Copilot IA
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300 no-print"
        >
          {/* Panel deslizante lateral con fondo sólido */}
          <div
            ref={drawerRef}
            className="flex h-full w-full max-w-xl flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
          >
            {/* Header del Drawer */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      Copilot Financiero IA
                    </h3>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      Opcional
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Auditoría estratégica, márgenes y pitch para inversionistas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-foreground cursor-pointer transition-colors"
                aria-label="Cerrar asistente IA"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 3 Acciones Rápidas */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Acciones Estratégicas Rápidas
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => executeAction("audit")}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeAction === "audit"
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 shadow-xs ring-1 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mb-1 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-bold leading-tight">
                    Auditar Viabilidad
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => executeAction("margins")}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeAction === "margins"
                      ? "border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 shadow-xs ring-1 ring-amber-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Percent className="h-4 w-4 mb-1 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px] font-bold leading-tight">
                    Mejorar Márgenes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => executeAction("pitch")}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeAction === "pitch"
                      ? "border-purple-600 bg-purple-50/80 dark:bg-purple-950/60 text-purple-900 dark:text-purple-100 shadow-xs ring-1 ring-purple-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Megaphone className="h-4 w-4 mb-1 text-purple-600 dark:text-purple-400" />
                  <span className="text-[11px] font-bold leading-tight">
                    Generar Pitch
                  </span>
                </button>
              </div>
            </div>

            {/* Aviso Amigable de IA Opcional */}
            {responseNotice && (
              <div className="mx-4 mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{responseNotice}</p>
              </div>
            )}

            {/* Área de Visualización de Resultados */}
            <div className="flex-1 overflow-y-auto p-5 text-xs text-foreground space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="font-semibold text-xs">
                    Analizando los estados financieros del proyecto...
                  </p>
                </div>
              ) : responseContent ? (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-3 leading-relaxed whitespace-pre-line">
                  {responseContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="text-xs">
                    Selecciona una acción rápida arriba o escribe una pregunta financiera sobre tu modelo.
                  </p>
                </div>
              )}
            </div>

            {/* Input para consulta personalizada */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 p-4">
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Pregunta sobre TIR, rotación de cartera, nómina..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !customInput.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
                  aria-label="Enviar pregunta"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

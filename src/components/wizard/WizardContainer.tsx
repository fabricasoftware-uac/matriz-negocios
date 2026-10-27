"use client";

import React from "react";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { WizardProgressBar } from "@/components/navigation/WizardProgressBar";
import { StepIdentity } from "./StepIdentity";
import { StepRevenue } from "./StepRevenue";
import { StepCapex } from "./StepCapex";
import { StepPayroll } from "./StepPayroll";
import { StepWorkingCapital } from "./StepWorkingCapital";
import { StepEnvironmental } from "./StepEnvironmental";
import { StepResults } from "./StepResults";

export function WizardContainer() {
  const { currentStep, prevStep, nextStep, setCurrentStep, resetToDefault, engineOutput } =
    useProject();

  const { irr, excelNpv, viability } = engineOutput;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentity />;
      case 2:
        return <StepRevenue />;
      case 3:
        return <StepCapex />;
      case 4:
        return <StepPayroll />;
      case 5:
        return <StepWorkingCapital />;
      case 6:
        return <StepEnvironmental />;
      case 7:
        return <StepResults />;
      default:
        return <StepIdentity />;
    }
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col flex-1">
      <WizardProgressBar />

      {/* Contenido del paso actual */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-6 pb-28">
        {renderStep()}
      </div>

      {/* Barra de navegación inferior flotante fija */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 px-6 py-3.5 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Mini-KPI reactivo siempre a la vista */}
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-muted-foreground">TIR:</span>
              <strong className={viability.isIrrViable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}>
                {(irr * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-muted-foreground">VPN:</span>
              <strong className={viability.isNpvViable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}>
                {formatCOP(excelNpv)}
              </strong>
            </div>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                viability.isOverallViable
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {viability.overallStatus}
            </span>
          </div>

          {/* Botones de Navegación del Wizard */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={resetToDefault}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              title="Restablecer parámetros a los valores por defecto del benchmark"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reiniciar Benchmark</span>
            </button>

            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors ${
                currentStep === 1
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : "hover:bg-muted text-foreground cursor-pointer"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span>Continuar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 cursor-pointer transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Volver al Inicio</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

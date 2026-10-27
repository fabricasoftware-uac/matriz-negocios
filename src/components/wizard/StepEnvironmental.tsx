"use client";

import React, { useState } from "react";
import { Leaf, ShieldAlert, Scale } from "lucide-react";
import { EnvironmentalManager } from "@/components/dashboard/EnvironmentalManager";
import { RiskManager } from "@/components/dashboard/RiskManager";
import { LegalTechnicalSummary } from "@/components/dashboard/LegalTechnicalSummary";

export function StepEnvironmental() {
  const [subTab, setSubTab] = useState<"conesa" | "risks" | "legal">("conesa");

  return (
    <div className="space-y-6">
      {/* Subtabs en Step 6 */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="inline-flex rounded-xl bg-muted p-1 border border-border" role="tablist">
          <button
            role="tab"
            aria-selected={subTab === "conesa"}
            onClick={() => setSubTab("conesa")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
              subTab === "conesa"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Matriz Ambiental (Conesa)</span>
          </button>

          <button
            role="tab"
            aria-selected={subTab === "risks"}
            onClick={() => setSubTab("risks")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
              subTab === "risks"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <span>Matriz de Riesgos & Heatmap 5x5</span>
          </button>

          <button
            role="tab"
            aria-selected={subTab === "legal"}
            onClick={() => setSubTab("legal")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
              subTab === "legal"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Estudio Legal & Técnico</span>
          </button>
        </div>
      </div>

      {subTab === "conesa" && <EnvironmentalManager />}
      {subTab === "risks" && <RiskManager />}
      {subTab === "legal" && <LegalTechnicalSummary />}
    </div>
  );
}

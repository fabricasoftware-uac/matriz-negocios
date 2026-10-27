"use client";

import React, { useState } from "react";
import { DollarSign, Users } from "lucide-react";
import { RevenueManager } from "@/components/dashboard/RevenueManager";
import { MarketManager } from "@/components/dashboard/MarketManager";

export function StepRevenue() {
  const [subTab, setSubTab] = useState<"revenue" | "market">("revenue");

  return (
    <div className="space-y-6">
      {/* Selector de subvista en Step 2 */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="inline-flex rounded-xl bg-muted p-1 border border-border" role="tablist">
          <button
            role="tab"
            aria-selected={subTab === "revenue"}
            onClick={() => setSubTab("revenue")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
              subTab === "revenue"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ingresos & Precios de Venta</span>
          </button>

          <button
            role="tab"
            aria-selected={subTab === "market"}
            onClick={() => setSubTab("market")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
              subTab === "market"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Estudio de Mercado & Radar (6 Competidores)</span>
          </button>
        </div>
      </div>

      {subTab === "revenue" ? <RevenueManager /> : <MarketManager />}
    </div>
  );
}

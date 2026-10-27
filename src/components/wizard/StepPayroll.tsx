"use client";

import React, { useState } from "react";
import { PayrollManager } from "@/components/dashboard/PayrollManager";
import { OpexManager } from "@/components/dashboard/OpexManager";
import { Users, ShoppingBag } from "lucide-react";

export function StepPayroll() {
  const [subView, setSubView] = useState<"payroll" | "costs">("payroll");

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl bg-muted p-1 border border-border w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={subView === "payroll"}
          onClick={() => setSubView("payroll")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
            subView === "payroll"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Nómina & Planta de Personal
        </button>
        <button
          role="tab"
          aria-selected={subView === "costs"}
          onClick={() => setSubView("costs")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
            subView === "costs"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Insumos Directos & OPEX
        </button>
      </div>

      {subView === "payroll" ? <PayrollManager /> : <OpexManager />}
    </div>
  );
}

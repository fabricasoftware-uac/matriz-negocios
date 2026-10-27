"use client";

import React from "react";
import { ProjectProvider, useProject } from "@/context/ProjectContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AiAssistantDrawer } from "@/components/ai/AiAssistantDrawer";

function WorkspaceView() {
  const { navMode } = useProject();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {navMode === "wizard" ? <WizardContainer /> : <DashboardView />}
      <AiAssistantDrawer />
    </div>
  );
}

export default function HomePage() {
  return (
    <ProjectProvider>
      <div className="min-h-screen flex bg-[#F9FAFC] dark:bg-slate-950 text-foreground antialiased selection:bg-violet-500/20">
        {/* Barra Lateral Izquierda Fija / Sticky */}
        <AppSidebar />

        {/* Contenedor Principal: TopHeader + Vista Activa */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <TopHeader />
          <main className="flex-1 flex flex-col min-h-0 overflow-y-auto" role="main">
            <WorkspaceView />
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}

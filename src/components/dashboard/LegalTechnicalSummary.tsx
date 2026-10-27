"use client";

import React, { useState } from "react";
import {
  Scale,
  Cpu,
  Building,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Users2,
  Share2,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export function LegalTechnicalSummary() {
  const { legalData, technicalData } = useProject();
  const [activeTab, setActiveTab] = useState<"legal" | "technical">("legal");

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Scale className="h-3.5 w-3.5" />
              Estudios Cualitativos
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {legalData.companyType}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1.5">
            Estudio Legal & Estudio Técnico del Proyecto
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Estructuración jurídica societaria y tributaria (S.A.S. Popayán) junto con el análisis de localización operativa y ventajas estratégicas del modelo audiovisual digital.
          </p>
        </div>

        {/* Subtabs Legal vs Técnico */}
        <div className="inline-flex rounded-xl bg-muted p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("legal")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "legal"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            Estudio Legal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("technical")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "technical"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            Estudio Técnico
          </button>
        </div>
      </div>

      {activeTab === "legal" ? (
        /* Pestaña Estudio Legal */
        <div className="space-y-6">
          {/* Tarjetas de Ficha Societaria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tipo Societario
              </span>
              <div className="mt-2 text-lg font-bold text-foreground">
                S.A.S. (Simplificada)
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {legalData.partnersCount} socios fundadores
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capital Suscrito & Pagado
              </span>
              <div className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCOP(legalData.paidCapital)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {legalData.shareCount} acciones a {formatCOP(legalData.shareNominalValue)} c/u
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Límite Representante Legal
              </span>
              <div className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                Hasta {legalData.legalRepLimitSmlmv} SMLMV
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Montos superiores exigen asamblea
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clasificación de Empresa
              </span>
              <div className="mt-2 text-lg font-bold text-foreground">
                Microempresa
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Decreto 1074/2015 DANE
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tarjeta Identificación Corporativa & CIIU */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-bold text-foreground">
                  Identidad Registral y Códigos de Actividad CIIU
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Razón Social Oficial</span>
                  <strong className="text-foreground text-sm">{legalData.companyName}</strong>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Nombre Comercial</span>
                  <strong className="text-foreground text-sm">{legalData.commercialName}</strong>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Representante Legal (Gerente)</span>
                  <strong className="text-foreground">{legalData.legalRepresentative}</strong>
                  <span className="block text-[11px] text-muted-foreground">CC: {legalData.legalRepId}</span>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Domicilio & Contacto</span>
                  <strong className="text-foreground">{legalData.address}</strong>
                  <span className="block text-[11px] text-muted-foreground">{legalData.city} • {legalData.phone}</span>
                </div>
              </div>

              {/* Clasificación de Actividades Económicas */}
              <div className="mt-4 space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Actividades Económicas Homologadas (RUES / DIAN)
                </span>

                <div className="flex items-start gap-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-2.5 border border-blue-500/20 text-xs">
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-mono font-bold text-white shrink-0">
                    CIIU {legalData.ciiuPrincipal.code}
                  </span>
                  <div>
                    <strong className="text-foreground">Actividad Principal:</strong>{" "}
                    <span className="text-muted-foreground">{legalData.ciiuPrincipal.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-muted/30 p-2.5 border border-border/60 text-xs">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono font-bold text-foreground shrink-0 border border-border">
                    CIIU {legalData.ciiuSecondary.code}
                  </span>
                  <div>
                    <strong className="text-foreground">Actividad Secundaria:</strong>{" "}
                    <span className="text-muted-foreground">{legalData.ciiuSecondary.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-muted/30 p-2.5 border border-border/60 text-xs">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono font-bold text-foreground shrink-0 border border-border">
                    CIIU {legalData.ciiuOther.code}
                  </span>
                  <div>
                    <strong className="text-foreground">Otras Actividades (J5911):</strong>{" "}
                    <span className="text-muted-foreground">{legalData.ciiuOther.name}</span>
                  </div>
                </div>
              </div>

              {/* Objeto Social */}
              <div className="mt-3 rounded-xl bg-muted/20 p-3 border border-border/50 text-xs">
                <span className="font-bold text-foreground block mb-1">Objeto Social Resumido:</span>
                <p className="text-muted-foreground leading-relaxed">
                  {legalData.corporatePurpose}
                </p>
              </div>
            </div>

            {/* Tarjeta Responsabilidades Tributarias DIAN & Supervisión */}
            <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-foreground">
                    Obligaciones y Registro Tributario DIAN
                  </h4>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  Responsabilidades fiscales formales registradas en el Registro Único Tributario (RUT):
                </p>

                <div className="space-y-2">
                  {legalData.dianObligations.map((ob, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2.5 text-xs text-foreground shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-medium">{ob}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Entidad de Vigilancia:</span>
                  <strong className="text-foreground">{legalData.supervisionEntity}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pestaña Estudio Técnico */
        <div className="space-y-6">
          {/* Métricas Técnicas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Localización</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {technicalData.city}, {technicalData.department}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Eje de producción y talento en el suroccidente
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Share2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Distribución</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                Viralidad Orgánica Local
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Red social comunitaria densa y rápida dispersión
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <Users2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Mano de Obra</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                Talento Universitario Joven
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estructuras salariales flexibles y alta adaptabilidad
              </p>
            </div>
          </div>

          {/* Factores Clave de Decisión de Localización */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-bold text-foreground">
                Factores Determinantes de la Decisión de Localización (Benchmark Técnico)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  1. Medios y Costos de Transporte
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {technicalData.transportFactors}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  2. Distribución Orgánica del Contenido
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {technicalData.organicDistributionFactor}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <span className="h-2 w-2 rounded-full bg-amber-600" />
                  3. Disponibilidad y Costo de Mano de Obra
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {technicalData.laborFactors}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  4. Oportunidad en Mercado Virgen
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {technicalData.virginMarketFactor}
                </p>
              </div>

              <div className="md:col-span-2 rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <span className="h-2 w-2 rounded-full bg-rose-600" />
                  5. Población Flexible y Receptiva
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {technicalData.populationFactor}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

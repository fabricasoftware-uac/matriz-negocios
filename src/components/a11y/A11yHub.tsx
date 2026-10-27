"use client";

import React, { useEffect, useRef } from "react";
import {
  Accessibility,
  Sun,
  Moon,
  Monitor,
  Type,
  Eye,
  Activity,
  RotateCcw,
  X,
  Check,
} from "lucide-react";
import { useA11y, type FontSize, type ThemeMode } from "@/context/A11yContext";

export function A11yHub() {
  const {
    preferences,
    isHubOpen,
    setFontSize,
    setContrast,
    setTheme,
    setReducedMotion,
    setDyslexicFont,
    setIsHubOpen,
    toggleHub,
    resetPreferences,
  } = useA11y();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // Foco al abrir/cerrar modal
  useEffect(() => {
    if (isHubOpen) {
      // Enfocar el botón de cerrar al abrir para accesibilidad con teclado
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      triggerButtonRef.current?.focus();
    }
  }, [isHubOpen]);

  // Trap focus dentro del modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  return (
    <>
      {/* Botón flotante accesible de apertura (ubicado en bottom-left para evitar colisión con Copilot IA) */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={toggleHub}
        aria-label="Menú de accesibilidad universal (Atajo: Alt + A)"
        aria-expanded={isHubOpen}
        aria-controls="a11y-dialog"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer dark:bg-blue-500 dark:hover:bg-blue-600 no-print"
      >
        <Accessibility className="h-7 w-7" aria-hidden="true" />
        <span className="sr-only">Abrir opciones de accesibilidad</span>
      </button>

      {/* Modal / Panel de Accesibilidad */}
      {isHubOpen && (
        <div
          role="dialog"
          id="a11y-dialog"
          aria-modal="true"
          aria-labelledby="a11y-dialog-title"
          aria-describedby="a11y-dialog-description"
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsHubOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-900 dark:text-slate-100"
          >
            {/* Header del Panel */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Accessibility className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="a11y-dialog-title"
                    className="text-xl font-bold tracking-tight text-foreground"
                  >
                    Centro de Accesibilidad Universal
                  </h2>
                  <p
                    id="a11y-dialog-description"
                    className="text-xs text-muted-foreground"
                  >
                    Personaliza la interfaz según tus preferencias y necesidades visuales.
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsHubOpen(false)}
                aria-label="Cerrar panel de accesibilidad (Escape)"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Controles de Accesibilidad */}
            <div className="space-y-6 pt-5">
              {/* 1. Tamaño del Texto */}
              <fieldset className="space-y-2">
                <legend className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Tamaño de Fuente y Escala
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "normal", label: "Normal (100%)", sub: "Estándar" },
                      { id: "large", label: "Grande (115%)", sub: "Lectura fácil" },
                      { id: "extra-large", label: "Muy Grande (130%)", sub: "Alta visibilidad" },
                    ] as const
                  ).map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setFontSize(size.id as FontSize)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors cursor-pointer ${
                        preferences.fontSize === size.id
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold dark:border-blue-400 dark:bg-blue-950/70 dark:text-blue-100 ring-2 ring-blue-500/20"
                          : "border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      aria-pressed={preferences.fontSize === size.id}
                    >
                      <span className="text-sm font-medium">{size.label}</span>
                      <span className="text-[11px] opacity-75">{size.sub}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 2. Contraste de Color (WCAG AAA) */}
              <fieldset className="space-y-2">
                <legend className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Modo de Contraste
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContrast("normal")}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-colors cursor-pointer ${
                      preferences.contrast === "normal"
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold dark:border-blue-400 dark:bg-blue-950/70 dark:text-blue-100"
                        : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"
                    }`}
                    aria-pressed={preferences.contrast === "normal"}
                  >
                    <span className="text-sm">Contraste Estándar</span>
                    {preferences.contrast === "normal" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContrast("high-contrast")}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-colors cursor-pointer ${
                      preferences.contrast === "high-contrast"
                        ? "border-amber-600 bg-amber-50 text-amber-950 font-bold dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30"
                        : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"
                    }`}
                    aria-pressed={preferences.contrast === "high-contrast"}
                  >
                    <div className="text-left">
                      <span className="text-sm block">Alto Contraste</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">WCAG AAA</span>
                    </div>
                    {preferences.contrast === "high-contrast" && <Check className="h-4 w-4" />}
                  </button>
                </div>
              </fieldset>

              {/* 3. Modo de Color / Tema */}
              <fieldset className="space-y-2">
                <legend className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sun className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Tema de Color
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "light", label: "Claro", icon: Sun },
                      { id: "dark", label: "Oscuro", icon: Moon },
                      { id: "system", label: "Sistema", icon: Monitor },
                    ] as const
                  ).map((themeOption) => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.id}
                        type="button"
                        onClick={() => setTheme(themeOption.id as ThemeMode)}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition-colors cursor-pointer ${
                          preferences.theme === themeOption.id
                            ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold dark:border-blue-400 dark:bg-blue-950/70 dark:text-blue-100"
                            : "border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        aria-pressed={preferences.theme === themeOption.id}
                      >
                        <IconComponent className="h-4 w-4" aria-hidden="true" />
                        <span>{themeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* 4. Conmutadores de Movimiento y Tipografía */}
              <div className="space-y-3 pt-2">
                {/* Reducción de movimiento */}
                <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
                  <div className="pr-3">
                    <label
                      htmlFor="reduced-motion-toggle"
                      className="text-sm font-semibold text-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Reducir Movimiento
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Desactiva transiciones y animaciones para prevenir mareos o fatiga.
                    </p>
                  </div>
                  <input
                    id="reduced-motion-toggle"
                    type="checkbox"
                    checked={preferences.reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Fuente para dislexia */}
                <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
                  <div className="pr-3">
                    <label
                      htmlFor="dyslexic-font-toggle"
                      className="text-sm font-semibold text-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Tipografía Adaptada
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Aumenta espaciado y usa glifos diferenciados para facilitar la lectura.
                    </p>
                  </div>
                  <input
                    id="dyslexic-font-toggle"
                    type="checkbox"
                    checked={preferences.dyslexicFont}
                    onChange={(e) => setDyslexicFont(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Footer con Atajos y Restablecer */}
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                    Alt + A
                  </kbd>
                  para abrir/cerrar
                </span>

                <button
                  type="button"
                  onClick={resetPreferences}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Restablecer todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

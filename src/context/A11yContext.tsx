"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FontSize = "normal" | "large" | "extra-large";
export type ContrastMode = "normal" | "high-contrast";
export type ThemeMode = "light" | "dark" | "system";

export interface A11yPreferences {
  fontSize: FontSize;
  contrast: ContrastMode;
  theme: ThemeMode;
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

interface A11yContextValue {
  preferences: A11yPreferences;
  isHubOpen: boolean;
  announcement: string;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: ContrastMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setReducedMotion: (reduced: boolean) => void;
  setDyslexicFont: (dyslexic: boolean) => void;
  setIsHubOpen: (open: boolean) => void;
  toggleHub: () => void;
  announce: (message: string) => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: A11yPreferences = {
  fontSize: "normal",
  contrast: "normal",
  theme: "system",
  reducedMotion: false,
  dyslexicFont: false,
};

const STORAGE_KEY = "matriz_negocios_a11y_prefs";

const A11yContext = createContext<A11yContextValue | undefined>(undefined);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<A11yPreferences>(DEFAULT_PREFERENCES);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [mounted, setMounted] = useState(false);

  // Cargar preferencias guardadas al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<A11yPreferences>;
        setPreferences((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Si falla localStorage (modo privado, etc.), mantenemos valores por defecto
    }
    setMounted(true);
  }, []);

  // Aplicar atributos al documento HTML y persistir en localStorage
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignorar error de escritura en localStorage
    }

    const root = document.documentElement;

    // Tamaño de fuente
    root.setAttribute("data-font-size", preferences.fontSize);

    // Contraste
    root.setAttribute("data-contrast", preferences.contrast);

    // Reducción de movimiento
    root.setAttribute("data-reduced-motion", preferences.reducedMotion ? "true" : "false");

    // Fuente para dislexia
    root.setAttribute("data-dyslexic", preferences.dyslexicFont ? "true" : "false");

    // Tema
    let effectiveTheme = preferences.theme;
    if (preferences.theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveTheme = prefersDark ? "dark" : "light";
    }

    root.setAttribute("data-theme", effectiveTheme);
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [preferences, mounted]);

  // Listener para cambio en el sistema operativo si está en modo "system"
  useEffect(() => {
    if (!mounted || preferences.theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      const theme = e.matches ? "dark" : "light";
      root.setAttribute("data-theme", theme);
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, preferences.theme]);

  // Listener global de teclado (Alt + A para conmutar A11yHub, Escape para cerrar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsHubOpen((prev) => !prev);
      } else if (e.key === "Escape" && isHubOpen) {
        setIsHubOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHubOpen]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Limpiar anuncio tras un tiempo para permitir re-anunciar el mismo mensaje si ocurre nuevamente
    const timer = setTimeout(() => {
      setAnnouncement("");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setPreferences((prev) => ({ ...prev, fontSize }));
    const labels: Record<FontSize, string> = {
      normal: "Tamaño de fuente estándar",
      large: "Tamaño de fuente grande activado",
      "extra-large": "Tamaño de fuente muy grande activado",
    };
    announce(labels[fontSize]);
  }, [announce]);

  const setContrast = useCallback((contrast: ContrastMode) => {
    setPreferences((prev) => ({ ...prev, contrast }));
    announce(
      contrast === "high-contrast"
        ? "Modo de alto contraste activado (WCAG AAA)"
        : "Modo de contraste estándar activado"
    );
  }, [announce]);

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences((prev) => ({ ...prev, theme }));
    const labels: Record<ThemeMode, string> = {
      light: "Tema claro activado",
      dark: "Tema oscuro activado",
      system: "Tema sincronizado con el sistema",
    };
    announce(labels[theme]);
  }, [announce]);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setPreferences((prev) => ({ ...prev, reducedMotion }));
    announce(
      reducedMotion
        ? "Reducción de movimiento activada. Las transiciones animadas han sido desactivadas."
        : "Animaciones y transiciones suaves habilitadas."
    );
  }, [announce]);

  const setDyslexicFont = useCallback((dyslexicFont: boolean) => {
    setPreferences((prev) => ({ ...prev, dyslexicFont }));
    announce(
      dyslexicFont
        ? "Tipografía de alta legibilidad para dislexia activada."
        : "Tipografía estándar restaurada."
    );
  }, [announce]);

  const toggleHub = useCallback(() => {
    setIsHubOpen((prev) => !prev);
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    announce("Preferencias de accesibilidad restablecidas a los valores por defecto.");
  }, [announce]);

  return (
    <A11yContext.Provider
      value={{
        preferences,
        isHubOpen,
        announcement,
        setFontSize,
        setContrast,
        setTheme,
        setReducedMotion,
        setDyslexicFont,
        setIsHubOpen,
        toggleHub,
        announce,
        resetPreferences,
      }}
    >
      {children}
      {/* Región viva invisible para lectores de pantalla */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-region"
      >
        {announcement}
      </div>
    </A11yContext.Provider>
  );
}

export function useA11y(): A11yContextValue {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error("useA11y must be used within an A11yProvider");
  }
  return context;
}

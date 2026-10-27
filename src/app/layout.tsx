import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { A11yProvider } from "@/context/A11yContext";
import { A11yHub } from "@/components/a11y/A11yHub";

export const metadata: Metadata = {
  title: "Matriz de Negocios | Evaluación Financiera de Proyectos",
  description:
    "Plataforma accesible de modelado financiero, evaluación de viabilidad (TIR, VPN, KTNO) y factibilidad socioambiental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" data-font-size="normal" data-contrast="normal">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-blue-500/20">
        <A11yProvider>
          {children}
          <A11yHub />
        </A11yProvider>
      </body>
    </html>
  );
}

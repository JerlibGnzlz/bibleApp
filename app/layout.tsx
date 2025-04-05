/* eslint-disable @next/next/no-sync-scripts */
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Metadata } from 'next';
import { Footer } from "@/components/ui/footer";

// Definir los metadatos
export const metadata: Metadata = {
  title: "Planificador de Prédicas",
  description: "Aplicación para planificar y organizar prédicas",
  manifest: "/manifest.json",
  themeColor: "#2c3e50",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Planificador de Prédicas",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#2c3e50" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
          <Footer  />
        </ThemeProvider>
        {/* Cargar el script para registrar el service worker */}
        {typeof window !== 'undefined' && <script src="/sw-register.js" />}
      </body>
    </html>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-sync-scripts */
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Metadata, Viewport } from 'next';

// Configuración moderna para themeColor y viewport
export const viewport: Viewport = {
  themeColor: "#2c3e50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Planificador de Prédicas",
  description: "Organiza y prepara tus mensajes bíblicos de manera eficiente.",
  manifest: "/manifest.json",
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
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2c3e50" />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
        {/* Registro del Service Worker para PWA */}
        <script src="/sw-register.js" defer />
      </body>
    </html>
  );
}
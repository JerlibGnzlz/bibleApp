"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

function isIOS(): boolean {
    if (typeof navigator === "undefined") return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function isStandalone(): boolean {
    if (typeof window === "undefined") return false
    return window.matchMedia("(display-mode: standalone)").matches
        || ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showIOSGuide, setShowIOSGuide] = useState(false)
    const [installed, setInstalled] = useState(false)

    useEffect(() => {
        setInstalled(isStandalone())
    }, [])

    useEffect(() => {
        if (installed) return

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }, [installed])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            await deferredPrompt.userChoice
            setDeferredPrompt(null)
            return
        }

        if (isIOS()) {
            setShowIOSGuide(true)
        }
    }

    if (installed) return null

    const showButton = deferredPrompt || isIOS()

    if (!showButton) return null

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={handleInstallClick}
            >
                {deferredPrompt ? (
                    <>
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Instalar App</span>
                        <span className="sm:hidden">Instalar</span>
                    </>
                ) : (
                    <>
                        <Smartphone className="h-4 w-4" />
                        <span className="hidden sm:inline">Instalar en iPhone</span>
                        <span className="sm:hidden">Instalar</span>
                    </>
                )}
            </Button>

            <AlertDialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
                <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Instalar en iPhone</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sigue estos pasos para agregar la app a tu pantalla de inicio:
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
                        <li>Abrí esta página en <strong>Safari</strong> (no en Chrome ni en el navegador de Instagram).</li>
                        <li>Tocá el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba).</li>
                        <li>Deslizá y elegí <strong>Agregar a pantalla de inicio</strong>.</li>
                        <li>Tocá <strong>Agregar</strong>. Listo — aparecerá como una app.</li>
                    </ol>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

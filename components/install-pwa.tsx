/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
        // Check if the app is already installed
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches

        if (isStandalone) {
            setIsInstallable(false)
            return
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Update UI to notify the user they can install the PWA
            setIsInstallable(true)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return
        }

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null)

        // Hide the install button
        setIsInstallable(false)
    }

    if (!isInstallable) {
        return null
    }

    return (
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleInstallClick}>
            <Download className="h-4 w-4" />
            <span>Instalar App</span>
        </Button>
    )
}


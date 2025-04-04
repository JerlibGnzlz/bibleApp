"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PWADebug() {
    const [debugInfo, setDebugInfo] = useState({
        isHttps: false,
        hasServiceWorker: false,
        hasManifest: false,
        isStandalone: false,
        isOnline: false,
        userAgent: "",
        swRegistration: null as ServiceWorkerRegistration | null,
    })

    useEffect(() => {
        // Check if running on HTTPS
        const isHttps = window.location.protocol === "https:" || window.location.hostname === "localhost"

        // Check if service worker is supported
        const hasServiceWorker = "serviceWorker" in navigator

        // Check if running in standalone mode (installed)
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches

        // Check if online
        const isOnline = navigator.onLine

        // Get user agent
        const userAgent = navigator.userAgent

        setDebugInfo((prev) => ({
            ...prev,
            isHttps,
            hasServiceWorker,
            isStandalone,
            isOnline,
            userAgent,
        }))

        // Check for manifest
        fetch("/manifest.json")
            .then((response) => {
                setDebugInfo((prev) => ({
                    ...prev,
                    hasManifest: response.ok,
                }))
            })
            .catch(() => {
                setDebugInfo((prev) => ({
                    ...prev,
                    hasManifest: false,
                }))
            })

        // Check service worker registration
        if (hasServiceWorker) {
            navigator.serviceWorker
                .getRegistration()
                .then((registration) => {
                    setDebugInfo((prev) => ({
                        ...prev,
                        swRegistration: registration,
                    }))
                })
                .catch((error) => {
                    console.error("Error checking SW registration:", error)
                })
        }
    }, [])

    const registerServiceWorker = () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Service Worker registered with scope:", registration.scope)
                    setDebugInfo((prev) => ({
                        ...prev,
                        swRegistration: registration,
                    }))
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error)
                })
        }
    }

    const unregisterServiceWorker = () => {
        if (debugInfo.swRegistration) {
            debugInfo.swRegistration
                .unregister()
                .then((success) => {
                    if (success) {
                        console.log("Service Worker unregistered")
                        setDebugInfo((prev) => ({
                            ...prev,
                            swRegistration: null,
                        }))
                    }
                })
                .catch((error) => {
                    console.error("Service Worker unregistration failed:", error)
                })
        }
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Diagnóstico PWA</CardTitle>
                <CardDescription>Información para depurar problemas de instalación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                        <span>HTTPS:</span>
                        <Badge variant={debugInfo.isHttps ? "default" : "destructive"}>{debugInfo.isHttps ? "Sí" : "No"}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Service Worker API:</span>
                        <Badge variant={debugInfo.hasServiceWorker ? "default" : "destructive"}>
                            {debugInfo.hasServiceWorker ? "Disponible" : "No disponible"}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Manifest:</span>
                        <Badge variant={debugInfo.hasManifest ? "default" : "destructive"}>
                            {debugInfo.hasManifest ? "Encontrado" : "No encontrado"}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Modo Standalone:</span>
                        <Badge variant={debugInfo.isStandalone ? "default" : "outline"}>
                            {debugInfo.isStandalone ? "Instalada" : "No instalada"}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Online:</span>
                        <Badge variant={debugInfo.isOnline ? "default" : "destructive"}>{debugInfo.isOnline ? "Sí" : "No"}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Service Worker:</span>
                        <Badge variant={debugInfo.swRegistration ? "default" : "destructive"}>
                            {debugInfo.swRegistration ? "Registrado" : "No registrado"}
                        </Badge>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground break-all">
                    <p>
                        <strong>User Agent:</strong> {debugInfo.userAgent}
                    </p>
                    {debugInfo.swRegistration && (
                        <p>
                            <strong>SW Scope:</strong> {debugInfo.swRegistration.scope}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    {!debugInfo.swRegistration ? (
                        <Button onClick={registerServiceWorker} size="sm">
                            Registrar Service Worker
                        </Button>
                    ) : (
                        <Button onClick={unregisterServiceWorker} variant="outline" size="sm">
                            Desregistrar Service Worker
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}


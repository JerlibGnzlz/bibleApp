"use client"

import { useEffect, useState } from "react"

export const ZOOM_MIN = 0.85
export const ZOOM_MAX = 1.75
export const ZOOM_STEP = 0.1

export function clampZoom(value: number) {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 10) / 10))
}

export function useFontZoom(storageKey: string, defaultZoom = 1.1) {
    const [zoom, setZoom] = useState(defaultZoom)

    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            const parsed = parseFloat(saved)
            if (!Number.isNaN(parsed)) setZoom(clampZoom(parsed))
        }
    }, [storageKey])

    useEffect(() => {
        localStorage.setItem(storageKey, String(zoom))
    }, [storageKey, zoom])

    const zoomIn = () => setZoom((z) => clampZoom(z + ZOOM_STEP))
    const zoomOut = () => setZoom((z) => clampZoom(z - ZOOM_STEP))
    const resetZoom = () => setZoom(defaultZoom)

    return { zoom, zoomIn, zoomOut, resetZoom, setZoom }
}

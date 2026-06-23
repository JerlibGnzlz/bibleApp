"use client"

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ZOOM_MIN, ZOOM_MAX } from "@/hooks/use-font-zoom"

interface FontZoomControlsProps {
    zoom: number
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
    compact?: boolean
}

export function FontZoomControls({
    zoom,
    onZoomIn,
    onZoomOut,
    onReset,
    compact = false,
}: FontZoomControlsProps) {
    return (
        <div className={compact ? "flex items-center gap-1" : "flex items-center gap-1.5"}>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onZoomOut}
                disabled={zoom <= ZOOM_MIN}
                className={compact ? "h-8 w-8 rounded-full" : "h-9 w-9"}
                title="Reducir texto"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>
            <button
                type="button"
                onClick={onReset}
                className="min-w-[2.75rem] text-xs font-semibold text-muted-foreground hover:text-foreground tabular-nums"
                title="Restablecer tamaño"
            >
                {Math.round(zoom * 100)}%
            </button>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onZoomIn}
                disabled={zoom >= ZOOM_MAX}
                className={compact ? "h-8 w-8 rounded-full" : "h-9 w-9"}
                title="Aumentar texto"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
            {!compact && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onReset}
                    className="h-9 w-9"
                    title="Tamaño predeterminado"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    )
}

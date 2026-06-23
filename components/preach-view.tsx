"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FontZoomControls } from "@/components/font-zoom-controls"
import { useMobile } from "@/hooks/use-mobile"
import { useFontZoom } from "@/hooks/use-font-zoom"
import type { Task } from "@/lib/types"

const PREACH_ZOOM_KEY = "preach-font-zoom"
const BASE_FONT_PX = 19

interface PreachViewProps {
    task: Task
    onClose: () => void
}

export function PreachView({ task, onClose }: PreachViewProps) {
    const isMobile = useMobile()
    const { zoom, zoomIn, zoomOut, resetZoom } = useFontZoom(PREACH_ZOOM_KEY, 1.15)

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [onClose])

    const dateLabel = isMobile
        ? format(new Date(task.dueDate), "d MMM yyyy", { locale: es })
        : format(new Date(task.dueDate), "EEEE d 'de' MMMM yyyy", { locale: es })

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden h-[100dvh] w-full max-w-[100vw]">
            <header className="flex-shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3 md:px-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <div className="max-w-3xl mx-auto flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Modo Predicar
                            </span>
                        </div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words leading-snug">
                            {task.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md break-words max-w-full">
                                {task.verse}
                            </span>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                                {task.category || "Dominical"}
                            </Badge>
                            <span className="text-xs text-muted-foreground w-full sm:w-auto">
                                {dateLabel}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <FontZoomControls
                            zoom={zoom}
                            onZoomIn={zoomIn}
                            onZoomOut={zoomOut}
                            onReset={resetZoom}
                            compact={isMobile}
                        />
                        {!isMobile && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full h-9 w-9"
                                title="Cerrar (Esc)"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y w-full min-w-0">
                <article className="max-w-3xl mx-auto w-full min-w-0 px-4 py-5 md:px-8 md:py-10 pb-10 box-border">
                    {task.notes ? (
                        <div
                            className="preach-content rich-content w-full min-w-0"
                            style={{ fontSize: `${BASE_FONT_PX * zoom}px` }}
                            dangerouslySetInnerHTML={{ __html: task.notes }}
                        />
                    ) : (
                        <p className="text-muted-foreground italic text-center py-12">
                            No hay bosquejo ni notas para esta prédica.
                        </p>
                    )}
                </article>
            </main>

            {isMobile && (
                <footer className="flex-shrink-0 border-t border-border/60 bg-background/95 backdrop-blur-sm px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full h-11 text-base max-w-3xl mx-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                    </Button>
                </footer>
            )}
        </div>
    )
}

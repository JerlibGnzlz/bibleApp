"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import type { Task } from "@/lib/types"

interface PreachViewProps {
    task: Task
    onClose: () => void
}

export function PreachView({ task, onClose }: PreachViewProps) {
    const isMobile = useMobile()

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
        <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden h-[100dvh] w-full">
            {/* Header fijo — compacto en móvil */}
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
                    {!isMobile && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onClose}
                            className="flex-shrink-0 rounded-full h-9 w-9"
                            title="Cerrar (Esc)"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </header>

            {/* Contenido — solo scroll vertical */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y">
                <article className="max-w-3xl mx-auto px-4 py-5 md:px-8 md:py-10 pb-6">
                    {task.notes ? (
                        <div
                            className="preach-content rich-content"
                            dangerouslySetInnerHTML={{ __html: task.notes }}
                        />
                    ) : (
                        <p className="text-muted-foreground italic text-center py-12">
                            No hay bosquejo ni notas para esta prédica.
                        </p>
                    )}
                </article>
            </main>

            {/* Barra inferior en móvil — fácil de alcanzar con el pulgar */}
            {isMobile && (
                <footer className="flex-shrink-0 border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full h-11 text-base"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                    </Button>
                </footer>
            )}
        </div>
    )
}

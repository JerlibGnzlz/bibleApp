"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { useTasks } from "@/lib/task-provider"
import { useMobile } from "@/hooks/use-mobile"
import type { Task } from "@/lib/types"
import { stripHtml } from "@/lib/utils"

interface TaskCalendarProps {
    onEdit: (task: Task) => void
}

export function TaskCalendar({ onEdit }: TaskCalendarProps) {
    const { tasks } = useTasks()
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
    const isMobile = useMobile()

    // Get tasks for the selected date
    const tasksForSelectedDate = tasks.filter((task: { dueDate: string | number | Date }) => isSameDay(new Date(task.dueDate), selectedDate))

    return (
        <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            <Card className="glass-card border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                    <CardTitle>Calendario</CardTitle>
                    <CardDescription>Seleccione una fecha para ver las prédicas programadas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        locale={es}
                        modifiers={{
                            taskDay: (date) => tasks.some((task: { dueDate: string | number | Date }) => isSameDay(new Date(task.dueDate), date)),
                        }}
                        modifiersClassNames={{
                            taskDay: "bg-primary/20 text-primary font-bold",
                        }}
                        className="rounded-md border mx-auto"
                    />
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle>Prédicas para {format(selectedDate, "PPP", { locale: es })}</CardTitle>
                    <CardDescription>
                        {tasksForSelectedDate.length === 0
                            ? "No hay prédicas programadas para esta fecha"
                            : `${tasksForSelectedDate.length} prédica(s) programada(s)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tasksForSelectedDate.map((task: Task) => (
                            <div key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-card/20">
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <h3 className="font-semibold text-base text-foreground/90">{task.title}</h3>
                                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                                        {task.category || "Dominical"}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                    <p className="flex items-center justify-between">
                                        <span>Versículo:</span>
                                        <span className="font-mono text-primary font-semibold bg-primary/5 px-1.5 py-0.5 rounded">{task.verse}</span>
                                    </p>
                                </div>

                                {expandedTaskId === task.id ? (
                                    <div className="mt-3 pt-3 border-t border-border/40 space-y-3 animate-in fade-in duration-200">
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bosquejo / Notas:</span>
                                            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-sm leading-relaxed max-h-[300px] overflow-y-auto overflow-x-hidden">
                                                {task.notes ? (
                                                    <div
                                                        className="rich-content"
                                                        dangerouslySetInnerHTML={{ __html: task.notes }}
                                                    />
                                                ) : (
                                                    <span className="text-muted-foreground italic">No hay notas o bosquejo.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    task.notes && (
                                        <p className="text-xs mb-3 text-muted-foreground/80 line-clamp-2 italic">
                                            {stripHtml(task.notes)}
                                        </p>
                                    )
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-background/50 border-border/50 text-xs"
                                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                    >
                                        {expandedTaskId === task.id ? "Ocultar" : "Ver Detalle"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs"
                                        onClick={() => onEdit(task)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

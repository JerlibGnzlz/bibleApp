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

interface TaskCalendarProps {
    onSelectTask: (task: Task) => void
}

export function TaskCalendar({ onSelectTask }: TaskCalendarProps) {
    const { tasks } = useTasks()
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const isMobile = useMobile()

    // Get tasks for the selected date
    const tasksForSelectedDate = tasks.filter((task: { dueDate: string | number | Date }) => isSameDay(new Date(task.dueDate), selectedDate))

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 border-red-300"
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "low":
                return "bg-green-100 text-green-800 border-green-300"
            default:
                return ""
        }
    }

    return (
        <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            <Card>
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

            <Card>
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
                            <div key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{task.title}</h3>
                                    <Badge className={getPriorityColor(task.priority)}>
                                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">Versículo: {task.verse}</p>
                                {task.notes && <p className="text-sm mb-3">{task.notes}</p>}
                                <Button variant="outline" size="sm" onClick={() => onSelectTask(task)} className="w-full mt-2">
                                    Editar
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


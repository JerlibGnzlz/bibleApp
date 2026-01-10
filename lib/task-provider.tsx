"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { addDays, isBefore, isAfter } from "date-fns"
import type { Task, TaskContextType } from "@/lib/types"

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([])
    // Estado para controlar que la notificación solo salga una vez por sesión para no ser molesto
    const [hasCheckedUpcoming, setHasCheckedUpcoming] = useState(false)

    // Cargar tareas al iniciar desde localStorage
    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks")
        if (storedTasks) {
            try {
                // Parse date strings back to Date objects
                const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
                    ...task,
                    dueDate: new Date(task.dueDate),
                    createdAt: new Date(task.createdAt)
                }))
                setTasks(parsedTasks)
            } catch (error) {
                console.error("Failed to parse tasks", error)
            }
        }
    }, [])

    // Guardar tareas en localStorage cuando cambian
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])

    // Verificar tareas próximas (Sistema de Notificaciones)
    useEffect(() => {
        if (tasks.length === 0 || hasCheckedUpcoming) return

        const today = new Date()
        const threeDaysFromNow = addDays(today, 3)

        const upcomingCount = tasks.filter(task => {
            const dueDate = new Date(task.dueDate)
            return isAfter(dueDate, today) && isBefore(dueDate, threeDaysFromNow)
        }).length

        if (upcomingCount > 0) {
            toast.info(`Recordatorio Semanal`, {
                description: `Tienes ${upcomingCount} prédica(s) para los próximos días.`,
                duration: 5000,
            })
        }

        setHasCheckedUpcoming(true)
    }, [tasks, hasCheckedUpcoming])

    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task])
        toast.success("Prédica agregada correctamente")
    }

    const updateTask = (updatedTask: Task) => {
        setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
        toast.success("Prédica actualizada")
    }

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id))
        toast.error("Prédica eliminada")
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider")
    }
    return context
}

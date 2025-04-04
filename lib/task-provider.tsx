"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { addDays, isBefore, isAfter } from "date-fns"
import type { Task, TaskContextType } from "@/lib/types"

// Create context with proper typing
const TaskContext = createContext<TaskContextType | null>(null)

interface TaskProviderProps {
    children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([])

    // Load tasks from localStorage on mount
    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks")
        if (storedTasks) {
            try {
                setTasks(JSON.parse(storedTasks))
            } catch (error) {
                console.error("Error parsing tasks from localStorage:", error)
            }
        }
    }, [])

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])

    // Check for upcoming tasks and show notifications
    useEffect(() => {
        const checkUpcomingTasks = () => {
            const today = new Date()
            const threeDaysFromNow = addDays(today, 3)

            const upcomingTasks = tasks.filter((task) => {
                const taskDate = new Date(task.dueDate)
                return isAfter(taskDate, today) && isBefore(taskDate, threeDaysFromNow)
            })

            const overdueTasks = tasks.filter((task) => {
                return isBefore(new Date(task.dueDate), today)
            })

            if (upcomingTasks.length > 0) {
                toast.info("Prédicas próximas", {
                    description: `Tienes ${upcomingTasks.length} prédica(s) en los próximos 3 días.`,
                })
            }

            if (overdueTasks.length > 0) {
                toast.error("Prédicas vencidas", {
                    description: `Tienes ${overdueTasks.length} prédica(s) vencidas.`,
                })
            }
        }

        // Check on initial load
        checkUpcomingTasks()

        // Set up interval to check periodically (every hour)
        const interval = setInterval(checkUpcomingTasks, 3600000)

        return () => clearInterval(interval)
    }, [tasks])

    // Add a new task
    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task])
        toast.success("Prédica agregada", {
            description: "La prédica ha sido agregada exitosamente.",
        })
    }

    // Update an existing task
    const updateTask = (updatedTask: Task) => {
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
        toast.success("Prédica actualizada", {
            description: "La prédica ha sido actualizada exitosamente.",
        })
    }

    // Delete a task
    const deleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
        toast.success("Prédica eliminada", {
            description: "La prédica ha sido eliminada exitosamente.",
        })
    }

    return <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>{children}</TaskContext.Provider>
}

// Custom hook to use the task context
export function useTasks(): TaskContextType {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider")
    }
    return context
}


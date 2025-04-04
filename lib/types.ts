export interface Task {
    id: string
    title: string
    verse: string
    notes?: string
    dueDate: Date | string
    priority: "low" | "medium" | "high"
    createdAt: Date | string
}

export interface TaskContextType {
    tasks: Task[]
    addTask: (task: Task) => void
    updateTask: (task: Task) => void
    deleteTask: (id: string) => void
}


"use client"

import { useState } from "react"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Edit, Trash2, AlertTriangle } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { useTasks } from "@/lib/task-provider"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"
import type { Task } from "@/lib/types"
import { useTasks } from "@/lib/task-provider"

interface TaskTableProps {
    onEdit: (task: Task) => void
}

export function TaskTable({ onEdit }: TaskTableProps) {
    const { tasks, deleteTask } = useTasks()
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const isMobile = useMobile()

    const sortedTasks = [...tasks].sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high":
                return <Badge variant="destructive">Alta</Badge>
            case "medium":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Media
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Baja
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocida</Badge>
        }
    }

    const isUpcoming = (date: Date) => {
        const today = new Date()
        const sevenDaysFromNow = addDays(today, 7)
        return isAfter(date, today) && isBefore(date, sevenDaysFromNow)
    }

    const isOverdue = (date: Date) => {
        return isBefore(date, new Date())
    }

    // Mobile card view
    if (isMobile) {
        return (
            <div className="space-y-4">
                {sortedTasks.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-6 text-muted-foreground">
                            No hay prédicas programadas. Agregue una nueva prédica.
                        </CardContent>
                    </Card>
                ) : (
                    sortedTasks.map((task) => (
                        <Card key={task.id} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {task.title}
                                        {isUpcoming(new Date(task.dueDate)) && <AlertTriangle size={16} className="text-yellow-500" />}
                                        {isOverdue(new Date(task.dueDate)) && <AlertTriangle size={16} className="text-red-500" />}
                                    </CardTitle>
                                    {getPriorityBadge(task.priority)}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid gap-1 mb-3">
                                    <div className="text-sm">
                                        <span className="font-medium">Versículo:</span> {task.verse}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">Fecha:</span> {format(new Date(task.dueDate), "PPP", { locale: es })}
                                    </div>
                                    {task.notes && (
                                        <div className="text-sm mt-2">
                                            <span className="font-medium">Notas:</span> {task.notes}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(task)}>
                                        <Edit className="h-4 w-4 mr-1" /> Editar
                                    </Button>
                                    <AlertDialog open={taskToDelete === task.id} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setTaskToDelete(task.id)}>
                                                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la prédica.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteTask(task.id)}>Eliminar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        )
    }

    // Desktop table view
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Versículo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No hay prédicas programadas. Agregue una nueva prédica.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {task.title}
                                            {isUpcoming(new Date(task.dueDate)) && <AlertTriangle size={16} className="text-yellow-500" />}
                                            {isOverdue(new Date(task.dueDate)) && <AlertTriangle size={16} className="text-red-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>{task.verse}</TableCell>
                                    <TableCell>{format(new Date(task.dueDate), "PPP", { locale: es })}</TableCell>
                                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog
                                                open={taskToDelete === task.id}
                                                onOpenChange={(open) => !open && setTaskToDelete(null)}
                                            >
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setTaskToDelete(task.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente la prédica.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteTask(task.id)}>Eliminar</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


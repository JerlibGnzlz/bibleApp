"use client"

import { useState } from "react"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Edit, Trash2, AlertTriangle, Search, X } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    const [searchQuery, setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const isMobile = useMobile()

    // Lógica de filtrado
    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        const matchesCategory = categoryFilter === "all" || (task.category || "Dominical") === categoryFilter;

        return matchesSearch && matchesPriority && matchesCategory;
    })

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high":
                return <Badge variant="destructive">Alta</Badge>
            case "medium":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700">
                        Media
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
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

    // Componente de barra de herramientas (Buscador + Filtros)
    const FilterToolbar = () => (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título, versículo..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="pl-9 glass-input rounded-full border-muted-foreground/20"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                <div className="w-full md:w-[200px]">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="glass-input rounded-full border-muted-foreground/20">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Categorías</SelectItem>
                            <SelectItem value="Dominical">Dominical</SelectItem>
                            <SelectItem value="Estudio Bíblico">Estudio Bíblico</SelectItem>
                            <SelectItem value="Jóvenes">Jóvenes</SelectItem>
                            <SelectItem value="Evangelismo">Evangelismo</SelectItem>
                            <SelectItem value="Mujeres">Mujeres</SelectItem>
                            <SelectItem value="Hombres">Hombres</SelectItem>
                            <SelectItem value="Especial">Especial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-muted/30 rounded-full border border-border/50 overflow-x-auto no-scrollbar self-start">
                {(["all", "high", "medium", "low"] as const).map((p) => (
                    <Button
                        key={p}
                        variant={priorityFilter === p ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPriorityFilter(p)}
                        className={`rounded-full px-4 capitalize transition-all ${priorityFilter === p ? "shadow-md" : "hover:bg-background/50"}`}
                    >
                        {p === "all" ? "Todas" : p === "high" ? "Alta" : p === "medium" ? "Media" : "Baja"}
                    </Button>
                ))}
            </div>
        </div>
    )

    // Mobile card view
    if (isMobile) {
        return (
            <div className="space-y-4">
                <FilterToolbar />
                {sortedTasks.length === 0 ? (
                    <Card className="glass-card border-dashed border-2">
                        <CardContent className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p>No se encontraron prédicas.</p>
                            {searchQuery || priorityFilter !== "all" || categoryFilter !== "all" ? (
                                <Button variant="link" onClick={() => { setSearchQuery(""); setPriorityFilter("all"); setCategoryFilter("all"); }}>
                                    Limpiar filtros
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                ) : (
                    sortedTasks.map((task) => (
                        <Card key={task.id} className="glass-card overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex flex-wrap gap-2 mb-1.5">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                                {task.category || "Dominical"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
                                            {task.title}
                                            {isUpcoming(new Date(task.dueDate)) && <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />}
                                            {isOverdue(new Date(task.dueDate)) && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />}
                                        </CardTitle>
                                    </div>
                                    {getPriorityBadge(task.priority)}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid gap-1.5 mb-3">
                                    <div className="text-sm flex items-center gap-2 text-muted-foreground">
                                        <span className="bg-secondary/50 px-2 py-0.5 rounded text-xs font-medium border border-border/30">
                                            {task.verse}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {format(new Date(task.dueDate), "EEEE d 'de' MMMM", { locale: es })}
                                    </div>
                                    {task.notes && (
                                        <div className="text-sm mt-1 text-muted-foreground/80 italic line-clamp-2">
                                            "{task.notes}"
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3 opacity-100 transition-opacity">
                                    <Button variant="outline" size="sm" className="flex-1 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => onEdit(task)}>
                                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Editar
                                    </Button>
                                    <AlertDialog open={taskToDelete === task.id} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={() => setTaskToDelete(task.id)}>
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Eliminar
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
                                                <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
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
        <div className="space-y-4">
            <FilterToolbar />

            <Card className="glass-card border-none shadow-sm bg-card/40">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/40">
                                <TableHead className="w-[30%]">Título</TableHead>
                                <TableHead className="w-[15%]">Categoría</TableHead>
                                <TableHead className="w-[20%]">Versículo</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Prioridad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="h-10 w-10 opacity-20" />
                                            <p className="text-lg font-medium">No se encontraron resultados</p>
                                            <p className="text-sm">Intenta ajustar tu búsqueda o filtros.</p>
                                            {searchQuery || priorityFilter !== "all" || categoryFilter !== "all" ? (
                                                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setPriorityFilter("all"); setCategoryFilter("all"); }} className="mt-2">
                                                    Limpiar filtros
                                                </Button>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedTasks.map((task) => (
                                    <TableRow key={task.id} className="group hover:bg-primary/5 border-b border-border/40 transition-colors">
                                        <TableCell>
                                            <div className="font-semibold text-base mb-1 flex items-center gap-2">
                                                {task.title}
                                                {isUpcoming(new Date(task.dueDate)) &&
                                                    <div title="Próximamente" className="animate-pulse">
                                                        <AlertTriangle size={16} className="text-yellow-500" />
                                                    </div>
                                                }
                                                {isOverdue(new Date(task.dueDate)) &&
                                                    <div title="Vencida">
                                                        <AlertTriangle size={16} className="text-red-500" />
                                                    </div>
                                                }
                                            </div>
                                            {task.notes && (
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px] opacity-70">
                                                    {task.notes}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-medium bg-primary/10 text-primary border-primary/20">
                                                {task.category || "Dominical"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-secondary/50 px-2 py-1 rounded-md text-sm font-medium border border-border/30">
                                                {task.verse}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {format(new Date(task.dueDate), "PPP", { locale: es })}
                                        </TableCell>
                                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog
                                                    open={taskToDelete === task.id}
                                                    onOpenChange={(open) => !open && setTaskToDelete(null)}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setTaskToDelete(task.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
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
                                                            <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
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
        </div>
    )
}

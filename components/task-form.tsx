"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/lib/types"
import { useTasks } from "@/lib/task-provider"
import { RichTextEditor } from "@/components/rich-text-editor"

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "El título debe tener al menos 2 caracteres."),
    verse: z.string().min(2, "El versículo debe tener al menos 2 caracteres."),
    notes: z.string().optional(),
    dueDate: z.date({ required_error: "Por favor seleccione una fecha." }),
    category: z.string().min(1, "Seleccione una categoría"),
})

type FormValues = z.infer<typeof formSchema>

interface TaskFormProps {
    task: Task | null
    onComplete: () => void
}

export function TaskForm({ task = null, onComplete }: TaskFormProps) {
    const { addTask, updateTask } = useTasks()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            verse: "",
            notes: "",
            category: "Dominical",
            dueDate: new Date(),
        },
    })

    useEffect(() => {
        if (task) {
            form.reset({
                id: task.id,
                title: task.title,
                verse: task.verse,
                notes: task.notes || "",
                category: task.category || "Dominical",
                dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
            })
        } else {
            form.reset({
                title: "",
                verse: "",
                notes: "",
                category: "Dominical",
                dueDate: new Date(),
            })
        }
    }, [task, form])

    function onSubmit(values: FormValues) {
        if (task) {
            updateTask({
                ...task,
                ...values,
                dueDate: values.dueDate,
                createdAt: task.createdAt,
            })
        } else {
            addTask({
                id: crypto.randomUUID(),
                ...values,
                createdAt: new Date(),
            })
        }
        onComplete()
    }

    return (
        <Card className="glass-card shadow-xl border-white/20">
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    {task ? "Editar Prédica" : "Nueva Prédica"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Tema / Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: La importancia de la fe" {...field} className="glass-input text-lg font-semibold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ficha Técnica */}
                            <div className="md:col-span-1 space-y-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Ficha Técnica
                                </h4>
                                <div className="border border-border/60 rounded-lg overflow-hidden bg-background/50 p-4 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Categoría
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="glass-input rounded-md border-muted-foreground/20">
                                                            <SelectValue placeholder="Seleccione categoría" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="glass-card">
                                                        <SelectItem value="Dominical">Dominical</SelectItem>
                                                        <SelectItem value="Lunes de Oración">Lunes de Oración</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="verse"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Versículo
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Juan 3:16" {...field} className="glass-input font-mono text-primary font-semibold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Fecha
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full glass-input rounded-md border-muted-foreground/20 text-left font-normal h-10 px-3",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP", { locale: es })
                                                                ) : (
                                                                    <span>Escoja una fecha</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 glass-card" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date("1900-01-01")}
                                                            initialFocus
                                                            locale={es}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {task && (
                                        <div className="pt-2 border-t border-border/40">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Creado</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(task.createdAt), "PPp", { locale: es })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bosquejo y Notas */}
                            <div className="md:col-span-2 space-y-4 min-w-0 w-full">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Notas / Bosquejo
                                </h4>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Escribe tu bosquejo: usa títulos, listas, negritas..."
                                                    className="min-h-[400px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="flex-1 h-11 text-base shadow-lg shadow-primary/20">
                                {task ? "Actualizar" : "Programar"} Prédica
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onComplete}
                                className="px-6 h-11 border-muted-foreground/20 hover:bg-background/50"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

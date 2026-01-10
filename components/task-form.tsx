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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "El título debe tener al menos 2 caracteres."),
    verse: z.string().min(2, "El versículo debe tener al menos 2 caracteres."),
    notes: z.string().optional(),
    dueDate: z.date({ required_error: "Por favor seleccione una fecha." }),
    priority: z.enum(["low", "medium", "high"]),
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
            priority: "medium",
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
                priority: task.priority,
                category: task.category || "Dominical",
                dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
            })
        } else {
            form.reset({
                title: "",
                verse: "",
                notes: "",
                priority: "medium",
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
            <CardHeader>
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
                                        <Input placeholder="Ej: La importancia de la fe" {...field} className="glass-input" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="verse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Versículo Base</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Juan 3:16" {...field} className="glass-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Categoría</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="glass-input rounded-md border-muted-foreground/20">
                                                    <SelectValue placeholder="Seleccione categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glass-card">
                                                <SelectItem value="Dominical">Dominical</SelectItem>
                                                <SelectItem value="Estudio Bíblico">Estudio Bíblico</SelectItem>
                                                <SelectItem value="Jóvenes">Jóvenes</SelectItem>
                                                <SelectItem value="Evangelismo">Evangelismo</SelectItem>
                                                <SelectItem value="Mujeres">Mujeres</SelectItem>
                                                <SelectItem value="Hombres">Hombres</SelectItem>
                                                <SelectItem value="Especial">Especial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-sm font-semibold">Prioridad</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                // @ts-ignore
                                                value={field.value}
                                                className="flex space-x-4"
                                            >
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="low" className="text-green-500 border-green-500" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">Baja</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="medium" className="text-yellow-500 border-yellow-500" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">Media</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="high" className="text-red-500 border-red-500" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">Alta</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
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
                                        <FormLabel className="text-sm font-semibold mb-1">Fecha de Predicación</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
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
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    locale={es}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Notas / Bosquejo breve</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Añade puntos clave o pensamientos adicionales..."
                                            className="resize-none glass-input min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
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

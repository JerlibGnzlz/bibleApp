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
import { cn } from "@/lib/utils"
// import { useTasks } from "@/lib/task-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/lib/types"
import { useTasks } from "@/lib/task-provider"

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, {
        message: "El título debe tener al menos 2 caracteres.",
    }),
    verse: z.string().min(2, {
        message: "El versículo debe tener al menos 2 caracteres.",
    }),
    notes: z.string().optional(),
    dueDate: z.date({
        required_error: "Por favor seleccione una fecha.",
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Por favor seleccione una prioridad.",
    }),
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
            dueDate: new Date(),
        },
    })

    useEffect(() => {
        if (task) {
            form.reset({
                ...task,
                dueDate: new Date(task.dueDate),
            })
        } else {
            form.reset({
                title: "",
                verse: "",
                notes: "",
                priority: "medium",
                dueDate: new Date(),
            })
        }
    }, [task, form])

    function onSubmit(values: FormValues) {
        if (values.id) {
            updateTask({
                ...values,
                createdAt: task?.createdAt || new Date(),
            } as Task)
        } else {
            addTask({
                ...values,
                id: Date.now().toString(),
                createdAt: new Date(),
            } as Task)
        }

        form.reset({
            title: "",
            verse: "",
            notes: "",
            priority: "medium",
            dueDate: new Date(),
        })

        onComplete()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{task ? "Editar" : "Agregar"} Prédica</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título de la Prédica</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el título" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="verse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Versículo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Juan 3:16" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Notas adicionales" {...field} />
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
                                    <FormLabel>Fecha</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Prioridad</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="low" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-green-600">Baja</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="medium" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-yellow-600">Media</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="high" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-red-600">Alta</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button type="submit" className="flex-1">
                                {task ? "Actualizar" : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" onClick={onComplete} className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


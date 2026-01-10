"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { TaskForm } from "@/components/task-form"
import { TaskTable } from "@/components/task-table"
import { TaskCalendar } from "@/components/task-calendar"
import { TaskProvider, useTasks } from "@/lib/task-provider"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, List, Settings, BookOpen, Clock, Activity } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { InstallPWA } from "@/components/install-pwa"
import type { Task } from "@/lib/types"
import { PWADebug } from "@/components/pwa-debug"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Componente Dashboard interno para acceder al contexto
function DashboardContent({
  onEdit,
  onTabChange
}: {
  onEdit: (task: Task | null) => void,
  onTabChange: (tab: string) => void
}) {
  const { tasks } = useTasks()
  const isMobile = useMobile()

  // Calcular estadísticas
  const upcomingTasks = tasks
    .filter(t => new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const nextTask = upcomingTasks[0]
  const tasksThisMonth = tasks.filter(t => {
    const d = new Date(t.dueDate)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Próxima Prédica - Featured Card */}
      <div className="md:col-span-2 glass-card rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BookOpen className="w-24 h-24" />
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Próxima Prédica</h3>

        {nextTask ? (
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 text-primary">{nextTask.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-lg text-foreground/80 bg-primary/10 px-2 py-0.5 rounded-md">
                {nextTask.verse}
              </span>
              <span className="text-xs font-bold text-primary border border-primary/20 px-2 py-1.5 rounded-full uppercase self-center">
                {nextTask.category || "Dominical"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>{format(new Date(nextTask.dueDate), "EEEE d 'de' MMMM", { locale: es })}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                <Clock className="w-4 h-4 text-primary" />
                <span className="capitalize">{nextTask.priority === 'high' ? 'Alta Prioridad' : nextTask.priority === 'medium' ? 'Prioridad Media' : 'Prioridad Baja'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 relative z-10">
            <p className="text-xl text-muted-foreground italic">No hay prédicas programadas próximamente.</p>
            <Button onClick={() => {
              onEdit(null)
              onTabChange("form")
            }} variant="default" className="mt-2 text-white shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Programar Nueva
            </Button>
          </div>
        )}
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-rows-2 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Este Mes</p>
            <p className="text-3xl font-bold">{tasksThisMonth}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Planificadas</p>
            <p className="text-3xl font-bold">{tasks.length}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("table")
  const [showDebug, setShowDebug] = useState(false)
  const isMobile = useMobile()

  // Switch to form tab when a task is selected for editing
  useEffect(() => {
    if (selectedTask) {
      setActiveTab("form")
    }
  }, [selectedTask])

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto py-6 px-4 md:py-8 space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Planificador de Prédicas
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Organiza y prepara tus mensajes bíblicos de manera eficiente.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-auto">
              <InstallPWA />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDebug(!showDebug)}
                title="Diagnóstico PWA"
                className="rounded-full shadow-sm hover:bg-background h-9 w-9"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DashboardContent
            onEdit={setSelectedTask}
            onTabChange={setActiveTab}
          />

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-3 w-[400px]'} mb-6 glass-card p-1`}>
              <TabsTrigger value="table" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <List className="w-4 h-4 mr-2" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="form" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Plus className="w-4 h-4 mr-2" />
                {selectedTask ? "Editar" : "Nueva"}
              </TabsTrigger>
            </TabsList>

            <div className="animate-in fade-in zoom-in-95 duration-300">
              <TabsContent value="table">
                <TaskTable onEdit={(task) => {
                  setSelectedTask(task)
                  setActiveTab("form")
                }} />
              </TabsContent>

              <TabsContent value="calendar">
                <div className="glass-card rounded-xl border-none shadow-sm bg-card/40 p-1">
                  <TaskCalendar onEdit={setSelectedTask} />
                </div>
              </TabsContent>

              <TabsContent value="form">
                <div className="max-w-2xl mx-auto">
                  <TaskForm
                    task={selectedTask}
                    onComplete={() => {
                      setSelectedTask(null)
                      setActiveTab("table")
                    }}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {showDebug && (
            <div className="mt-8 pt-8 border-t border-border/50">
              <PWADebug />
            </div>
          )}
        </div>
      </div>
    </TaskProvider>
  )
}

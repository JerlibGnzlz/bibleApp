"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskForm } from "@/components/task-form"
import { TaskTable } from "@/components/task-table"
import { TaskCalendar } from "@/components/task-calendar"
import { TaskProvider } from "@/lib/task-provider"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, List } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { InstallPWA } from "@/components/install-pwa"
import type { Task } from "@/lib/types"

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("table")
  const isMobile = useMobile()

  // Switch to form tab when a task is selected for editing
  useEffect(() => {
    if (selectedTask) {
      setActiveTab("form")
    }
  }, [selectedTask])

  return (
    <TaskProvider>
      <div className="container mx-auto py-4 px-2 md:py-6 md:px-4 space-y-4 md:space-y-6 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Planificador de Prédicas</h1>
          <InstallPWA />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4">
            <TabsTrigger value="table" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden md:inline">Calendario</span>
            </TabsTrigger>
            {!isMobile && (
              <TabsTrigger value="form" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">{selectedTask ? "Editar" : "Agregar"}</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="table" className="mt-0">
            <TaskTable onEdit={setSelectedTask} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <TaskCalendar onSelectTask={setSelectedTask} />
          </TabsContent>

          <TabsContent value="form" className="mt-0">
            <TaskForm
              task={selectedTask}
              onComplete={() => {
                setSelectedTask(null)
                if (isMobile) {
                  setActiveTab("table")
                }
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Floating action button on mobile */}
        {isMobile && activeTab !== "form" && (
          <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
            onClick={() => {
              setSelectedTask(null)
              setActiveTab("form")
            }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </div>
    </TaskProvider>
  )
}


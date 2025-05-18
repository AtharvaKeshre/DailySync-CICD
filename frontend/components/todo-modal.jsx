"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Initial tasks data
const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    completed: false,
    priority: "high",
    dueDate: "2025-04-20",
  },
  {
    id: 2,
    title: "Schedule doctor appointment",
    completed: true,
    priority: "medium",
    dueDate: "2025-04-16",
  },
  {
    id: 3,
    title: "Buy groceries",
    completed: false,
    priority: "low",
    dueDate: "2025-04-18",
  },
]

// Priority options
const priorityOptions = [
  { value: "high", label: "High", color: "bg-red-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-green-500" },
]

// Get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export default function TodoModal({ isOpen, onClose }) {
  // Load tasks from localStorage or use initial tasks
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("todoTasks")
      return savedTasks ? JSON.parse(savedTasks) : initialTasks
    }
    return initialTasks
  })

  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
  })
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todoTasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Create a new task
  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your task.",
        variant: "destructive",
      })
      return
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
    })
    setIsCreating(false)

    toast({
      title: "Task created",
      description: "Your task has been added to your todo list.",
    })
  }

  // Update an existing task
  const handleUpdateTask = () => {
    if (!editingTask) return

    const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? { ...editingTask } : task))

    setTasks(updatedTasks)
    setEditingTask(null)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))

    toast({
      title: "Task deleted",
      description: "Your task has been removed from your todo list.",
    })
  }

  // Toggle task completion
  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))

    setTasks(updatedTasks)
  }

  // Filter tasks by status and search query
  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const completedTasks = filteredTasks.filter((task) => task.completed)
  const pendingTasks = filteredTasks.filter((task) => !task.completed)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-600">Todo List</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search and Add Task */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {!isCreating && !editingTask && (
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            )}
          </div>

          {/* Task Form (Create/Edit) */}
          {(isCreating || editingTask) && (
            <Card className="mb-4">
              <CardContent className="pt-4 space-y-4">
                <Input
                  placeholder="Task title"
                  value={isCreating ? newTask.title : editingTask?.title}
                  onChange={(e) => {
                    if (isCreating) {
                      setNewTask({ ...newTask, title: e.target.value })
                    } else {
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  }}
                  className="mb-2"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Priority</label>
                    <Select
                      value={isCreating ? newTask.priority : editingTask?.priority}
                      onValueChange={(value) => {
                        if (isCreating) {
                          setNewTask({ ...newTask, priority: value })
                        } else {
                          setEditingTask({ ...editingTask, priority: value })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={isCreating ? newTask.dueDate : editingTask?.dueDate}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        } else {
                          setEditingTask({ ...editingTask, dueDate: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (isCreating) setIsCreating(false)
                      else setEditingTask(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isCreating ? handleCreateTask : handleUpdateTask}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isCreating ? "Add Task" : "Update Task"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Lists */}
          {!isCreating && !editingTask && (
            <Tabs defaultValue="pending" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Completed ({completedTasks.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="pending" className="h-full">
                  <ScrollArea className="h-[350px] pr-4">
                    {pendingTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {searchQuery ? "No matching tasks found." : "No pending tasks. Great job!"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {pendingTasks.map((task) => (
                          <Card key={task.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => handleToggleComplete(task.id)}
                                />
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {task.dueDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingTask(task)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="completed" className="h-full">
                  <ScrollArea className="h-[350px] pr-4">
                    {completedTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {searchQuery ? "No matching completed tasks found." : "No completed tasks yet."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {completedTasks.map((task) => (
                          <Card key={task.id} className="p-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => handleToggleComplete(task.id)}
                                />
                                <div>
                                  <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {task.dueDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

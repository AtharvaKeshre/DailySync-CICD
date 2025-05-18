"use client"

import { useState, useEffect, useRef } from "react"
import { X, Plus, Edit, Trash2, Save, Calendar, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Mock data for tasks
const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finish the draft and send it to the team for review",
    completed: false,
    priority: "high",
    dueDate: "2025-04-20",
  },
  {
    id: 2,
    title: "Schedule doctor appointment",
    description: "Call the clinic to schedule annual checkup",
    completed: true,
    priority: "medium",
    dueDate: "2025-04-16",
  },
  {
    id: 3,
    title: "Buy groceries",
    description: "Get items for the week: vegetables, fruits, bread, milk",
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
const getPriorityColor = (priority: string) => {
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

interface TodoDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function TodoDrawer({ isOpen, onClose }: TodoDrawerProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
  })
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Create a new task
  const handleCreateTask = () => {
    if (!newTask.title) {
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
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
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
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))

    toast({
      title: "Task deleted",
      description: "Your task has been removed from your todo list.",
    })
  }

  // Toggle task completion
  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))

    setTasks(updatedTasks)
  }

  // Filter tasks by status
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={drawerRef} className="w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-xl overflow-hidden">
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-purple-400">Todo List</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {isCreating ? (
              <Card className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <CardTitle className="text-purple-400">New Todo</CardTitle>
                  <CardDescription>Add a new item to your todo list</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Description (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Priority</label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Due Date</label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsCreating(false)} className="border-gray-700">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={handleCreateTask}
                  >
                    <Save className="mr-2 h-4 w-4" /> Add Todo
                  </Button>
                </CardFooter>
              </Card>
            ) : editingTask ? (
              <Card className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <CardTitle className="text-purple-400">Edit Todo</CardTitle>
                  <CardDescription>Update your task</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Task title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Description (optional)"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Priority</label>
                      <Select
                        value={editingTask.priority}
                        onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Due Date</label>
                      <Input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditingTask(null)} className="border-gray-700">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={handleUpdateTask}
                  >
                    <Save className="mr-2 h-4 w-4" /> Update Todo
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">Your Tasks</h3>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Todo
                </Button>
              </div>
            )}

            {!isCreating && !editingTask && (
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-100"
                  >
                    Pending ({pendingTasks.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-100"
                  >
                    Completed ({completedTasks.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="pt-4">
                  <ScrollArea className="h-[calc(100vh-240px)]">
                    <div className="space-y-3">
                      {pendingTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No pending tasks. Great job!</p>
                        </div>
                      ) : (
                        pendingTasks.map((task) => (
                          <Card key={task.id} className="bg-gray-800 border-gray-700">
                            <CardHeader className="p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => handleToggleComplete(task.id)}
                                    className="mt-1"
                                  />
                                  <div>
                                    <CardTitle className="text-base text-white">{task.title}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className={getPriorityColor(task.priority)}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                      </Badge>
                                      <div className="flex items-center text-xs text-gray-400">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {task.dueDate}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            {task.description && (
                              <CardContent className="py-0 px-3 pb-3">
                                <p className="text-xs text-gray-300">{task.description}</p>
                              </CardContent>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="completed" className="pt-4">
                  <ScrollArea className="h-[calc(100vh-240px)]">
                    <div className="space-y-3">
                      {completedTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No completed tasks yet.</p>
                        </div>
                      ) : (
                        completedTasks.map((task) => (
                          <Card key={task.id} className="bg-gray-800/50 border-gray-700">
                            <CardHeader className="p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => handleToggleComplete(task.id)}
                                    className="mt-1"
                                  />
                                  <div>
                                    <CardTitle className="text-base line-through text-gray-400">{task.title}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="outline">
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                      </Badge>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {task.dueDate}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </CardHeader>
                            {task.description && (
                              <CardContent className="py-0 px-3 pb-3">
                                <p className="text-xs text-gray-500 line-through">{task.description}</p>
                              </CardContent>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {!isCreating && !editingTask && (
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  <span>Completed: {completedTasks.length}</span>
                </div>
                <div>Total: {tasks.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

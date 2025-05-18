"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Calendar, Edit, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DateDisplay from "@/components/date-display"

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
  {
    id: 4,
    title: "Prepare presentation",
    description: "Create slides for the team meeting on Friday",
    completed: false,
    priority: "high",
    dueDate: "2025-04-19",
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

export default function TodoDashboard() {
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
      description: "Your task has been added to your action planner.",
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
      description: "Your task has been removed from your action planner.",
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

  // Get tasks due today
  const today = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((task) => task.dueDate === today && !task.completed)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Todo List
          </h1>
          <p className="text-muted-foreground">Organize your tasks and boost productivity</p>
        </div>
        <DateDisplay />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">New Todo</CardTitle>
                <CardDescription>Add a new item to your action planner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
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
            <Card>
              <CardHeader>
                <CardTitle>Edit Task</CardTitle>
                <CardDescription>Update your action item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Task title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Description (optional)"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleUpdateTask}>
                  <Save className="mr-2 h-4 w-4" /> Update Task
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-purple-600">Todo List</CardTitle>
                    <CardDescription>Manage your tasks and stay organized</CardDescription>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Todo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100">
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
                  <TabsContent value="pending" className="pt-4">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {pendingTasks.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No pending tasks. Great job!</p>
                          </div>
                        ) : (
                          pendingTasks.map((task) => (
                            <Card key={task.id} className="border border-muted">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={task.completed}
                                      onCheckedChange={() => handleToggleComplete(task.id)}
                                      className="mt-1"
                                    />
                                    <div>
                                      <CardTitle className="text-lg">{task.title}</CardTitle>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge className={getPriorityColor(task.priority)}>
                                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </Badge>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {task.dueDate}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              {task.description && (
                                <CardContent>
                                  <p className="text-sm">{task.description}</p>
                                </CardContent>
                              )}
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="completed" className="pt-4">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {completedTasks.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No completed tasks yet.</p>
                          </div>
                        ) : (
                          completedTasks.map((task) => (
                            <Card key={task.id} className="border border-muted bg-muted/30">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={task.completed}
                                      onCheckedChange={() => handleToggleComplete(task.id)}
                                      className="mt-1"
                                    />
                                    <div>
                                      <CardTitle className="text-lg line-through text-muted-foreground">
                                        {task.title}
                                      </CardTitle>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="outline">
                                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </Badge>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {task.dueDate}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              {task.description && (
                                <CardContent>
                                  <p className="text-sm text-muted-foreground line-through">{task.description}</p>
                                </CardContent>
                              )}
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Focus</CardTitle>
              <CardDescription>Tasks due today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No tasks due today.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="flex items-start space-x-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
              <CardDescription>Your productivity at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{pendingTasks.length}</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedTasks.length}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">By Priority</h3>
                  <div className="space-y-2">
                    {priorityOptions.map((priority) => {
                      const count = tasks.filter((t) => t.priority === priority.value && !t.completed).length
                      return (
                        <div key={priority.value} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${priority.color} mr-2`}></div>
                          <span className="text-sm">{priority.label}</span>
                          <span className="ml-auto text-sm font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Completion Rate</h3>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: tasks.length > 0 ? `${(completedTasks.length / tasks.length) * 100}%` : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {tasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : "0%"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

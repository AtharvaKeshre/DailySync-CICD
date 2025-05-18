"use client"

import { useState } from "react"
import { Search, Filter, Download, CheckCircle, XCircle, Clock, Calendar, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for todo statistics
const todoCompletionData = [
  { date: "Apr 12", completed: 24, added: 32 },
  { date: "Apr 13", completed: 18, added: 22 },
  { date: "Apr 14", completed: 29, added: 25 },
  { date: "Apr 15", completed: 34, added: 30 },
  { date: "Apr 16", completed: 28, added: 26 },
  { date: "Apr 17", completed: 32, added: 29 },
  { date: "Apr 18", completed: 36, added: 31 },
]

const priorityDistribution = [
  { name: "High", value: 28 },
  { name: "Medium", value: 45 },
  { name: "Low", value: 27 },
]

// Mock data for recent todo activity
const recentTodoActivity = [
  {
    id: 1,
    userId: 2,
    userName: "Jane Smith",
    action: "completed",
    todoTitle: "Complete project proposal",
    timestamp: "2025-04-18T14:22:18Z",
    priority: "high",
  },
  {
    id: 2,
    userId: 4,
    userName: "Emily Davis",
    action: "added",
    todoTitle: "Schedule team meeting",
    timestamp: "2025-04-18T13:45:12Z",
    priority: "medium",
  },
  {
    id: 3,
    userId: 7,
    userName: "David Miller",
    action: "completed",
    todoTitle: "Review quarterly reports",
    timestamp: "2025-04-18T11:10:45Z",
    priority: "medium",
  },
  {
    id: 4,
    userId: 2,
    userName: "Jane Smith",
    action: "added",
    todoTitle: "Prepare presentation slides",
    timestamp: "2025-04-18T10:33:27Z",
    priority: "high",
  },
  {
    id: 5,
    userId: 5,
    userName: "Michael Wilson",
    action: "deleted",
    todoTitle: "Call supplier about order",
    timestamp: "2025-04-17T19:05:38Z",
    priority: "low",
  },
  {
    id: 6,
    userId: 4,
    userName: "Emily Davis",
    action: "updated",
    todoTitle: "Send follow-up emails",
    timestamp: "2025-04-17T16:20:00Z",
    priority: "medium",
  },
  {
    id: 7,
    userId: 8,
    userName: "Lisa Taylor",
    action: "completed",
    todoTitle: "Update client database",
    timestamp: "2025-04-17T15:15:09Z",
    priority: "high",
  },
  {
    id: 8,
    userId: 2,
    userName: "Jane Smith",
    action: "added",
    todoTitle: "Research new marketing strategies",
    timestamp: "2025-04-17T14:42:51Z",
    priority: "medium",
  },
  {
    id: 9,
    userId: 7,
    userName: "David Miller",
    action: "updated",
    todoTitle: "Finalize budget proposal",
    timestamp: "2025-04-17T13:30:22Z",
    priority: "high",
  },
  {
    id: 10,
    userId: 4,
    userName: "Emily Davis",
    action: "completed",
    todoTitle: "Order office supplies",
    timestamp: "2025-04-17T11:05:14Z",
    priority: "low",
  },
]

export default function TodoManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  // Filter activity based on search query and filters
  const filteredActivity = recentTodoActivity.filter((activity) => {
    const matchesSearch =
      activity.todoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = actionFilter === "all" || activity.action === actionFilter
    const matchesPriority = priorityFilter === "all" || activity.priority === priorityFilter

    return matchesSearch && matchesAction && matchesPriority
  })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get action icon
  const getActionIcon = (action) => {
    switch (action) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "added":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "updated":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "deleted":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleExportData = () => {
    toast({
      title: "Exporting Todo Data",
      description: "Todo statistics are being exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todo Management</h1>
          <p className="text-muted-foreground">Monitor task completion and user activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trends</CardTitle>
            <CardDescription>Daily task completion vs. new tasks added</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  completed: {
                    label: "Completed Tasks",
                    color: "hsl(var(--chart-1))",
                  },
                  added: {
                    label: "New Tasks",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={todoCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="var(--color-completed)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="added" stroke="var(--color-added)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Tasks",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">High: {priorityDistribution[0].value}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">Medium: {priorityDistribution[1].value}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Low: {priorityDistribution[2].value}%</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Todo Activity</CardTitle>
          <CardDescription>Monitor user interactions with their todo lists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="added">Added</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No activity found matching your filters.</div>
              ) : (
                filteredActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="mt-0.5">{getActionIcon(activity.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.userName}</span>
                        <span className="text-muted-foreground">
                          {activity.action === "completed"
                            ? "completed"
                            : activity.action === "added"
                              ? "added"
                              : activity.action === "updated"
                                ? "updated"
                                : "deleted"}
                        </span>
                        <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                      </div>
                      <p className="text-sm font-medium mt-1 truncate">{activity.todoTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="mt-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

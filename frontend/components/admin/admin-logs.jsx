"use client"

import { useState } from "react"
import { Search, Filter, Send, AlertTriangle, Info, CheckCircle, XCircle, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Mock data for admin logs
const adminLogs = [
  {
    id: 1,
    type: "info",
    message: "System maintenance completed successfully",
    timestamp: "2025-04-18T14:22:18Z",
    admin: "John Doe",
  },
  {
    id: 2,
    type: "warning",
    message: "Multiple failed login attempts detected for user emily@example.com",
    timestamp: "2025-04-18T13:45:12Z",
    admin: "System",
  },
  {
    id: 3,
    type: "error",
    message: "Database backup failed - insufficient storage space",
    timestamp: "2025-04-18T11:10:45Z",
    admin: "System",
  },
  {
    id: 4,
    type: "success",
    message: "New user registration: michael@example.com",
    timestamp: "2025-04-18T10:33:27Z",
    admin: "System",
  },
  {
    id: 5,
    type: "info",
    message: "Updated privacy policy published",
    timestamp: "2025-04-17T19:05:38Z",
    admin: "Jane Smith",
  },
  {
    id: 6,
    type: "warning",
    message: "Server load approaching 85% capacity",
    timestamp: "2025-04-17T16:20:00Z",
    admin: "System",
  },
  {
    id: 7,
    type: "success",
    message: "Weekly data backup completed",
    timestamp: "2025-04-17T15:15:09Z",
    admin: "System",
  },
  {
    id: 8,
    type: "info",
    message: "User sarah@example.com upgraded to premium plan",
    timestamp: "2025-04-17T14:42:51Z",
    admin: "System",
  },
  {
    id: 9,
    type: "error",
    message: "Payment processing service temporarily unavailable",
    timestamp: "2025-04-17T13:30:22Z",
    admin: "System",
  },
  {
    id: 10,
    type: "info",
    message: "Scheduled system update planned for April 20, 2025",
    timestamp: "2025-04-17T11:05:14Z",
    admin: "John Doe",
  },
]

// Mock data for admin notes
const adminNotes = [
  {
    id: 1,
    content:
      "Reviewed user feedback from the latest survey. Key issues: mobile responsiveness and journal export feature.",
    timestamp: "2025-04-18T09:15:00Z",
    admin: "John Doe",
  },
  {
    id: 2,
    content:
      "Discussed new feature roadmap with development team. Prioritizing mood analytics and integration with calendar apps.",
    timestamp: "2025-04-17T14:30:00Z",
    admin: "Jane Smith",
  },
  {
    id: 3,
    content: "Investigated reports of slow loading times. Identified potential database optimization opportunities.",
    timestamp: "2025-04-16T11:45:00Z",
    admin: "John Doe",
  },
]

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [noteContent, setNoteContent] = useState("")
  const { toast } = useToast()

  // Filter logs based on search query and filters
  const filteredLogs = adminLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.admin.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || log.type === typeFilter

    return matchesSearch && matchesType
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

  // Get log icon
  const getLogIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  // Handle adding a new note
  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter some content for your note.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Note Added",
      description: "Your admin note has been saved.",
    })

    setNoteContent("")
  }

  const handleExportLogs = () => {
    toast({
      title: "Exporting Logs",
      description: "System logs are being exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Logs</h1>
          <p className="text-muted-foreground">System logs and internal notes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportLogs} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Logs */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No logs found matching your filters.</div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="mt-0.5">{getLogIcon(log.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              log.type === "info"
                                ? "default"
                                : log.type === "warning"
                                  ? "warning"
                                  : log.type === "error"
                                    ? "destructive"
                                    : "success"
                            }
                          >
                            {log.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                        </div>
                        <p className="text-sm mt-1">{log.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">By: {log.admin}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Admin Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Admin Notes</CardTitle>
            <CardDescription>Internal notes and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Add a new admin note..."
                className="min-h-[100px]"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleAddNote}>
                <Send className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Recent Notes</h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {adminNotes.map((note) => (
                    <div key={note.id} className="p-4 rounded-lg border">
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium">{note.admin}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

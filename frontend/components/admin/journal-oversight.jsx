"use client"

import { useState } from "react"
import { Search, Filter, Flag, Trash2, ChevronLeft, ChevronRight, Eye, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for journal entries
const mockJournalEntries = [
  {
    id: 1,
    userId: 2,
    userName: "Jane Smith",
    title: "Feeling accomplished today",
    content: "I managed to complete all my tasks ahead of schedule and even had time for a short walk in the park.",
    date: "2025-04-18T14:22:18Z",
    mood: "happy",
    flagged: false,
  },
  {
    id: 2,
    userId: 4,
    userName: "Emily Davis",
    title: "Struggling with work pressure",
    content: "The deadlines are piling up and I'm finding it hard to keep up. Need to find better coping strategies.",
    date: "2025-04-17T08:45:12Z",
    mood: "stressed",
    flagged: true,
  },
  {
    id: 3,
    userId: 2,
    userName: "Jane Smith",
    title: "Weekend reflections",
    content: "Spent quality time with family. It was nice to disconnect from work and focus on relationships.",
    date: "2025-04-15T16:10:45Z",
    mood: "content",
    flagged: false,
  },
  {
    id: 4,
    userId: 5,
    userName: "Michael Wilson",
    title: "New project excitement",
    content: "Got assigned to a new project today. The team seems great and I'm looking forward to the challenge.",
    date: "2025-04-14T10:33:27Z",
    mood: "excited",
    flagged: false,
  },
  {
    id: 5,
    userId: 7,
    userName: "David Miller",
    title: "Feeling down",
    content: "Nothing seems to be going right lately. I'm trying to stay positive but it's getting harder.",
    date: "2025-04-13T19:05:38Z",
    mood: "sad",
    flagged: true,
  },
  {
    id: 6,
    userId: 3,
    userName: "Robert Johnson",
    title: "Anxiety about presentation",
    content:
      "I have a big presentation tomorrow and I'm feeling really anxious about it. I've prepared well but still worried.",
    date: "2025-04-12T11:22:45Z",
    mood: "anxious",
    flagged: true,
  },
  {
    id: 7,
    userId: 6,
    userName: "Sarah Johnson",
    title: "Peaceful morning",
    content: "Woke up early and enjoyed a quiet morning with coffee and a good book. These moments are precious.",
    date: "2025-04-11T08:15:30Z",
    mood: "peaceful",
    flagged: false,
  },
]

export default function JournalOversight() {
  const [searchQuery, setSearchQuery] = useState("")
  const [moodFilter, setMoodFilter] = useState("all")
  const [flaggedFilter, setFlaggedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage] = useState(5)
  const [viewEntry, setViewEntry] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState(null)
  const [entries, setEntries] = useState(mockJournalEntries)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Filter entries based on search query, filters, and active tab
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesMood = moodFilter === "all" || entry.mood === moodFilter
    const matchesFlagged =
      flaggedFilter === "all" ||
      (flaggedFilter === "flagged" && entry.flagged) ||
      (flaggedFilter === "unflagged" && !entry.flagged)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "flagged" && entry.flagged) ||
      (activeTab === "concerning" && (entry.mood === "sad" || entry.mood === "anxious" || entry.mood === "stressed"))

    return matchesSearch && matchesMood && matchesFlagged && matchesTab
  })

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry)
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle journal actions
  const handleViewEntry = (entry) => {
    setViewEntry(entry)
  }

  const handleFlagEntry = (entryId) => {
    setEntries(entries.map((entry) => (entry.id === entryId ? { ...entry, flagged: !entry.flagged } : entry)))

    const entry = entries.find((e) => e.id === entryId)
    const newFlaggedState = !entry.flagged

    toast({
      title: newFlaggedState ? "Entry Flagged" : "Flag Removed",
      description: newFlaggedState
        ? `Journal entry has been flagged for review.`
        : `Flag has been removed from journal entry.`,
    })
  }

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setEntries(entries.filter((entry) => entry.id !== entryToDelete.id))
    setIsDeleteDialogOpen(false)
    setViewEntry(null)

    toast({
      title: "Entry Deleted",
      description: `Journal entry has been permanently deleted.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal Oversight</h1>
          <p className="text-muted-foreground">Monitor and manage user journal entries</p>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Entries</TabsTrigger>
          <TabsTrigger value="flagged" className="relative">
            Flagged
            {entries.filter((e) => e.flagged).length > 0 && (
              <Badge className="ml-2 bg-red-500">{entries.filter((e) => e.flagged).length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="concerning">Concerning Moods</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>Review, flag, or remove inappropriate journal entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={moodFilter} onValueChange={setMoodFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="stressed">Stressed</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={flaggedFilter} onValueChange={setFlaggedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by flag status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entries</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="unflagged">Unflagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No journal entries found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell>{entry.userName}</TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.mood === "happy" ||
                            entry.mood === "content" ||
                            entry.mood === "peaceful" ||
                            entry.mood === "excited"
                              ? "success"
                              : entry.mood === "anxious" || entry.mood === "stressed"
                                ? "warning"
                                : "destructive"
                          }
                          className={
                            entry.mood === "happy" ||
                            entry.mood === "content" ||
                            entry.mood === "peaceful" ||
                            entry.mood === "excited"
                              ? "bg-green-600"
                              : entry.mood === "anxious" || entry.mood === "stressed"
                                ? "bg-amber-600"
                                : "bg-red-600"
                          }
                        >
                          {entry.mood}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.flagged && (
                          <Badge variant="destructive" className="flex items-center gap-1 bg-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            Flagged
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewEntry(entry)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFlagEntry(entry.id)}
                            className={entry.flagged ? "text-amber-500" : ""}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredEntries.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredEntries.length)} of{" "}
                {filteredEntries.length} entries
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Entry Dialog */}
      <Dialog open={!!viewEntry} onOpenChange={(open) => !open && setViewEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewEntry?.title}</DialogTitle>
            <DialogDescription>
              By {viewEntry?.userName} • {formatDate(viewEntry?.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  viewEntry?.mood === "happy" ||
                  viewEntry?.mood === "content" ||
                  viewEntry?.mood === "peaceful" ||
                  viewEntry?.mood === "excited"
                    ? "success"
                    : viewEntry?.mood === "anxious" || viewEntry?.mood === "stressed"
                      ? "warning"
                      : "destructive"
                }
                className={
                  viewEntry?.mood === "happy" ||
                  viewEntry?.mood === "content" ||
                  viewEntry?.mood === "peaceful" ||
                  viewEntry?.mood === "excited"
                    ? "bg-green-600"
                    : viewEntry?.mood === "anxious" || viewEntry?.mood === "stressed"
                      ? "bg-amber-600"
                      : "bg-red-600"
                }
              >
                {viewEntry?.mood}
              </Badge>
              {viewEntry?.flagged && (
                <Badge variant="destructive" className="flex items-center gap-1 bg-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Flagged
                </Badge>
              )}
            </div>
            <div className="border rounded-md p-4 bg-muted/20">
              <p>{viewEntry?.content}</p>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleFlagEntry(viewEntry?.id)
                }}
              >
                <Flag className="h-4 w-4 mr-2" />
                {viewEntry?.flagged ? "Remove Flag" : "Flag Entry"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteClick(viewEntry)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Entry
              </Button>
            </div>
            <Button variant="outline" onClick={() => setViewEntry(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {entryToDelete && (
              <div className="border rounded-md p-4">
                <p>
                  <strong>Title:</strong> {entryToDelete.title}
                </p>
                <p>
                  <strong>User:</strong> {entryToDelete.userName}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(entryToDelete.date)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

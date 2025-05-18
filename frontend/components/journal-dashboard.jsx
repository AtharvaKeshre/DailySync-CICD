"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  ListTodo,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WeatherWidget from "@/components/weather-widget";
import DateDisplay from "@/components/date-display";
import {
  fetchUserEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  createCheckListItem,
  deleteCheckListItem,
} from "@/services/journalService";

// Mock data for journal entries
const initialEntries = [
  {
    id: 1,
    title: "A productive day",
    content:
      "Today was incredibly productive. I managed to complete all my tasks ahead of schedule and even had time for a short walk in the park.",
    date: "2025-04-15",
    mood: "happy",
    sentiment: 0.8,
    weather: "sunny",
  },
  {
    id: 2,
    title: "Feeling overwhelmed",
    content:
      "There's so much on my plate right now. Work deadlines are piling up and I'm finding it hard to keep up with everything.",
    date: "2025-04-14",
    mood: "stressed",
    sentiment: -0.4,
    weather: "cloudy",
  },
  {
    id: 3,
    title: "Weekend reflections",
    content:
      "Spent the weekend with family. It was nice to disconnect from work and focus on relationships that matter.",
    date: "2025-04-13",
    mood: "content",
    sentiment: 0.6,
    weather: "rainy",
  },
];

// Mock sentiment analysis function
const analyzeSentiment = (text) => {
  // In a real app, this would call an AI API
  const words = text.toLowerCase().split(" ");
  const positiveWords = [
    "happy",
    "good",
    "great",
    "excellent",
    "wonderful",
    "productive",
    "success",
  ];
  const negativeWords = [
    "sad",
    "bad",
    "terrible",
    "awful",
    "stressed",
    "overwhelmed",
    "failed",
  ];

  let score = 0;
  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  });

  return Math.max(-1, Math.min(1, score)); // Clamp between -1 and 1
};

// Mood options
const moodOptions = [
  { value: "happy", label: "Happy" },
  { value: "content", label: "Content" },
  { value: "neutral", label: "Neutral" },
  { value: "anxious", label: "Anxious" },
  { value: "stressed", label: "Stressed" },
  { value: "sad", label: "Sad" },
];

// Get mood badge color
const getMoodColor = (mood) => {
  switch (mood) {
    case "happy":
      return "bg-green-500";
    case "content":
      return "bg-emerald-400";
    case "neutral":
      return "bg-blue-400";
    case "anxious":
      return "bg-yellow-400";
    case "stressed":
      return "bg-orange-500";
    case "sad":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};

// Get sentiment description
const getSentimentDescription = (score) => {
  if (score > 0.5) return "Very Positive";
  if (score > 0.1) return "Positive";
  if (score > -0.1) return "Neutral";
  if (score > -0.5) return "Negative";
  return "Very Negative";
};

export default function JournalDashboard({ onOpenTodo }) {
  const [entries, setEntries] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
    weather: "sunny",
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        // Retrieve the JWT token (assumes it's stored in localStorage or cookies)
        const token = localStorage.getItem("token"); // Or use cookies if applicable

        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch(
          "http://localhost:8080/dailysync/checklist/show-checkList",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch checklist");
        }

        const data = await response.json();
        setChecklistItems(data);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    };

    fetchChecklist();
  }, []);

  const addChecklistItem = async (title) => {
    try {
      const newItem = await createCheckListItem({ title, checked: false });
      setChecklistItems((prev) => [...prev, newItem]); // Add the new item to the state
    } catch (error) {
      console.error("Error adding checklist item:", error);
    }
  };
  const toggleItemCompletion = (id) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        return item.id === id ? { ...item, checked: !item.checked } : item;
      })
    );
  };


  const handleCreateEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast({
        title: "Missing info",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const rawSentiment = analyzeSentiment(newEntry.content);

      const sentiment = rawSentiment > 0 ? "HAPPY" : "SAD"; 

      const isoDate = new Date().toISOString(); 

      const payload = {
        title: newEntry.title,
        content: newEntry.content,
        date: isoDate,
        sentiment: sentiment,
      };

      const created = await createJournalEntry(payload);
      setEntries([created, ...entries]);
      setIsCreating(false);
      toast({ title: "Entry created" });
    } catch (err) {
      toast({ title: "Failed to create entry", variant: "destructive" });
    }
  };


  const handleUpdateEntry = async () => {
    try {
      const sentimentScore = analyzeSentiment(editingEntry.content);
      const sentiment = sentimentScore > 0 ? "HAPPY" : "SAD";

      const updated = await updateJournalEntry(
        editingEntry.id?.$oid || editingEntry.id,
        {
          title: editingEntry.title,
          content: editingEntry.content,
          date: editingEntry.date,
          sentiment,
        }
      );

      setEntries((prev) =>
        prev.map((e) => (e.id?.$oid === updated.id?.$oid ? updated : e))
      );
      setEditingEntry(null);
      toast({ title: "Entry updated" });
    } catch (err) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!id) {
      toast({ title: "Invalid entry ID", variant: "destructive" });
      return;
    }

    try {
      await deleteJournalEntry(id); // Assumes endpoint /id/:id
      setEntries((prev) => prev.filter((e) => (e.id?.$oid || e.id) !== id));
      toast({ title: "Entry deleted" });
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
      console.error(err); // More helpful than just toast
    }
  };
  const handleDeleteChecklistItem = async (id) => {
    if (!id) {
      toast({ title: "Invalid entry ID", variant: "destructive" });
      return;
    }
    await deleteCheckListItem(id);
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await fetchUserEntries();
        setEntries(data);
      } catch (err) {
        console.log("Failed to fetch entries:" + err.message);
      }
    };
    loadEntries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            My Journal
          </h1>
          <p className="text-gray-400">
            Record your thoughts and track your mood
          </p>
        </div>
        <div className="flex items-center space-x-4">
          
          <DateDisplay />
          <WeatherWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isCreating ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  New Journal Entry
                </CardTitle>
                <CardDescription>
                  Record your thoughts and feelings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Entry title"
                    value={newEntry.title}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, title: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="What's on your mind today?"
                    className="min-h-[200px] bg-gray-800 border-gray-700"
                    value={newEntry.content}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, content: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Mood
                    </label>
                    <Select
                      value={newEntry.mood}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, mood: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Weather
                    </label>
                    <Select
                      value={newEntry.weather}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, weather: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="snowy">Snowy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="border-gray-700"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleCreateEntry}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Entry
                </Button>
              </CardFooter>
            </Card>
          ) : editingEntry ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Edit Journal Entry
                </CardTitle>
                <CardDescription>
                  Update your thoughts and feelings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Entry title"
                    value={editingEntry.title}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        title: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="What's on your mind today?"
                    className="min-h-[200px] bg-gray-800 border-gray-700"
                    value={editingEntry.content}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Mood
                    </label>
                    <Select
                      value={editingEntry.mood}
                      onValueChange={(value) =>
                        setEditingEntry({ ...editingEntry, mood: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Weather
                    </label>
                    <Select
                      value={editingEntry.weather}
                      onValueChange={(value) =>
                        setEditingEntry({ ...editingEntry, weather: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="snowy">Snowy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setEditingEntry(null)}
                  className="border-gray-700"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleUpdateEntry}
                >
                  <Save className="mr-2 h-4 w-4" /> Update Entry
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-purple-400">
                      Journal Entries
                    </CardTitle>
                    <CardDescription>
                      Your recent thoughts and reflections
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {entries.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">
                          No journal entries yet. Create your first entry!
                        </p>
                      </div>
                    ) : (
                      entries.map((entry) => (
                        <Card
                          key={entry.id?.$oid || entry.id}
                          className="bg-gray-800 border-gray-700"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-white">
                                  {entry.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-sm text-gray-400">
                                    {entry.date}
                                  </p>
                                  <Badge
                                    className={`${getMoodColor(entry.mood)}`}
                                  >
                                    {entry.mood
                                      ? entry.mood.charAt(0).toUpperCase() +
                                        entry.mood.slice(1)
                                      : "Not Specified"}
                                  </Badge>
                                  {/* {entry.weather === "sunny" && (
                                    <Sun className="h-4 w-4 text-yellow-500" />
                                  )}
                                  {entry.weather === "cloudy" && (
                                    <Cloud className="h-4 w-4 text-gray-500" />
                                  )}
                                  {entry.weather === "rainy" && (
                                    <CloudRain className="h-4 w-4 text-blue-500" />
                                  )}
                                  {entry.weather === "snowy" && (
                                    <CloudSnow className="h-4 w-4 text-blue-300" />
                                  )} */}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingEntry(entry)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteEntry(
                                      entry.id?.$oid || entry.id
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-300">
                              {entry.content}
                            </p>
                          </CardContent>
                          {/* <CardFooter className="pt-0">
                            <div className="w-full">
                              <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>Sentiment Analysis:</span>
                                <span>
                                  {getSentimentDescription(entry.sentiment)}
                                  
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                                <div
                                  className={`h-full rounded-full ${
                                    entry.sentiment > 0
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${
                                      Math.abs(entry.sentiment) * 100
                                    }%`,
                                    marginLeft:
                                      entry.sentiment < 0 ? "auto" : 0,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </CardFooter> */}
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="h-full w-full bg-gray-900">
            <CardContent className="h-full w-full bg-gray-900">
              <CardHeader>
                <CardTitle className="text-purple-400 ">Check List</CardTitle>
                <CardDescription>Track your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a new item"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                    <Button
                      onClick={() => {
                        if (newChecklistItem.trim()) {
                          addChecklistItem(newChecklistItem);
                          setNewChecklistItem(""); // Clear the input field
                        }
                      }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Add
                    </Button>
                  </div>
                  {checklistItems.length === 0 ? (
                    <p className="text-gray-400">No items in the checklist.</p>
                  ) : (
                    <ul className="space-y-2">
                      {checklistItems.map((item) => (
                        <li
                          key={item.id}
                          className="relative flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={!!item.checked} // Ensure `checked` is always a boolean
                            onChange={() => toggleItemCompletion(item.id)}
                            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                          />
                          <span
                            className={
                              item.checked
                                ? "line-through text-gray-500"
                                : "text-gray-300"
                            }
                          >
                            {item.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChecklistItem(item.id)}
                            className="absolute right-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

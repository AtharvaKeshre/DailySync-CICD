"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateDisplay from "@/components/date-display"

// Mock data for mood analytics
const moodData = {
  weekly: [
    { day: "Mon", mood: 0.7, weather: "sunny" },
    { day: "Tue", mood: 0.2, weather: "cloudy" },
    { day: "Wed", mood: -0.3, weather: "rainy" },
    { day: "Thu", mood: 0.5, weather: "sunny" },
    { day: "Fri", mood: 0.8, weather: "sunny" },
    { day: "Sat", mood: 0.6, weather: "cloudy" },
    { day: "Sun", mood: 0.4, weather: "sunny" },
  ],
  monthly: [
    { week: "Week 1", avgMood: 0.6, entries: 5 },
    { week: "Week 2", avgMood: 0.2, entries: 4 },
    { week: "Week 3", avgMood: -0.1, entries: 3 },
    { week: "Week 4", avgMood: 0.5, entries: 6 },
  ],
}

// Mock data for mood distribution
const moodDistribution = [
  { mood: "Happy", percentage: 40, color: "bg-green-500" },
  { mood: "Content", percentage: 25, color: "bg-emerald-400" },
  { mood: "Neutral", percentage: 15, color: "bg-blue-400" },
  { mood: "Anxious", percentage: 10, color: "bg-yellow-400" },
  { mood: "Stressed", percentage: 7, color: "bg-orange-500" },
  { mood: "Sad", percentage: 3, color: "bg-red-400" },
]

// Mock data for mood correlations
const moodCorrelations = [
  { factor: "Weather (Sunny)", correlation: 0.7, impact: "positive" },
  { factor: "Completed Tasks", correlation: 0.6, impact: "positive" },
  { factor: "Sleep Quality", correlation: 0.5, impact: "positive" },
  { factor: "Work Stress", correlation: -0.6, impact: "negative" },
  { factor: "Weather (Rainy)", correlation: -0.3, impact: "negative" },
]

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Mood Analytics</h1>
          <p className="text-gray-400">Insights into your emotional patterns</p>
        </div>
        <DateDisplay />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-400">Mood Trends</CardTitle>
                <CardDescription>Track how your mood changes over time</CardDescription>
              </div>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="weekly">Last 7 days</SelectItem>
                  <SelectItem value="monthly">Last 30 days</SelectItem>
                  <SelectItem value="quarterly">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
              {moodData.weekly.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center">
                    <div
                      className={`w-16 rounded-t-md ${
                        day.mood > 0.5
                          ? "bg-green-500"
                          : day.mood > 0
                            ? "bg-blue-400"
                            : day.mood > -0.5
                              ? "bg-orange-400"
                              : "bg-red-400"
                      }`}
                      style={{ height: `${Math.abs(day.mood) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-300">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-300">Very Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-xs text-gray-300">Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                <span className="text-xs text-gray-300">Negative</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <span className="text-xs text-gray-300">Very Negative</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Mood Distribution</CardTitle>
            <CardDescription>How your moods are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodDistribution.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">{item.mood}</span>
                    <span className="text-gray-300">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Mood Correlations</CardTitle>
            <CardDescription>Factors that influence your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodCorrelations.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">{item.factor}</span>
                    <span className={item.impact === "positive" ? "text-green-500" : "text-red-500"}>
                      {item.impact === "positive" ? "+" : ""}
                      {item.correlation.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${item.impact === "positive" ? "bg-green-500" : "bg-red-400"}`}
                      style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Correlation strength ranges from -1.0 to 1.0, where positive values indicate positive influence.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-full bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Insights & Recommendations</CardTitle>
            <CardDescription>Personalized suggestions based on your mood patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="insights">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger
                  value="insights"
                  className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-100"
                >
                  Insights
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-100"
                >
                  Recommendations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="insights" className="space-y-4 pt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Mood Patterns</h3>
                  <p className="text-sm text-gray-400">
                    Your mood tends to be most positive on Fridays and weekends. There's a noticeable dip mid-week,
                    particularly on Wednesdays.
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Weather Impact</h3>
                  <p className="text-sm text-gray-400">
                    Sunny weather correlates strongly with your positive moods. Consider planning important activities
                    on days with good weather forecasts.
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Task Completion</h3>
                  <p className="text-sm text-gray-400">
                    Days with higher task completion rates show improved mood scores. Setting and achieving goals
                    appears to positively impact your emotional wellbeing.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Mid-week Boost</h3>
                  <p className="text-sm text-gray-400">
                    Schedule enjoyable activities or self-care time on Wednesdays to help counteract the mid-week mood
                    dip.
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Weather Adaptation</h3>
                  <p className="text-sm text-gray-400">
                    On rainy days, try indoor activities that boost your mood, such as reading, cooking, or connecting
                    with friends.
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-gray-200">Task Management</h3>
                  <p className="text-sm text-gray-400">
                    Break larger tasks into smaller, achievable goals to increase your completion rate and the
                    associated positive mood effects.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

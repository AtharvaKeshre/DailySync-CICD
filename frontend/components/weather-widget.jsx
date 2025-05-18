"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog } from "lucide-react"

// Mock weather data (in a real app, this would come from a weather API)
const weatherOptions = [
  { type: "sunny", icon: Sun, temp: "20   °C", color: "text-yellow-500" },
  // { type: "cloudy", icon: Cloud, temp: "18°C", color: "text-gray-500" },
  // { type: "rainy", icon: CloudRain, temp: "15°C", color: "text-blue-500" },
  // { type: "snowy", icon: CloudSnow, temp: "2°C", color: "text-blue-300" },
  // { type: "foggy", icon: CloudFog, temp: "12°C", color: "text-gray-400" },
]

export default function WeatherWidget() {
  const [weather, setWeather] = useState(weatherOptions[0])

  // In a real app, you would fetch weather data from an API
  useEffect(() => {
    // Simulate API call by randomly selecting a weather type
    const randomIndex = Math.floor(Math.random() * weatherOptions.length)
    setWeather(weatherOptions[randomIndex])
  }, [])

  const WeatherIcon = weather.icon

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="flex items-center p-3 space-x-3">
        <WeatherIcon className={`h-6 w-6 ${weather.color}`} />
        <div>
          <p className="text-sm font-medium text-gray-200">{weather.temp}</p>
          <p className="text-xs text-gray-400 capitalize">{weather.type}</p>
        </div>
      </CardContent>
    </Card>
  )
}

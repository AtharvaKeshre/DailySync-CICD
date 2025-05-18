"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function DateDisplay() {
  const [date, setDate] = useState("")

  useEffect(() => {
    const today = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setDate(today.toLocaleDateString("en-US", options))
  }, [])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="flex items-center p-3 space-x-3">
        <Calendar className="h-5 w-5 text-purple-400" />
        <p className="text-sm font-medium text-gray-200">{date}</p>
      </CardContent>
    </Card>
  )
}

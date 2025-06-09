"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Activity, Calendar } from "lucide-react"

const normalReadings = {
  summary: {
    averageGasLevel: 4.2,
    peakGasLevel: 50.2,
    uptime: 99.8,
    lastWeekAverage: 3.9,
  },
  dailyAverages: [
    { date: "2024-01-20", average: 4.1 },
    { date: "2024-01-19", average: 3.8 },
    { date: "2024-01-18", average: 4.5 },
    { date: "2024-01-17", average: 3.9 },
    { date: "2024-01-16", average: 4.2 },
    { date: "2024-01-15", average: 5.1 },
    { date: "2024-01-14", average: 3.7 },
  ],
}

export default function NormalOperationsReport() {
  const generateNormalReport = () => {
    const reportData = {
      title: "Normal Operations Report",
      content: normalReadings,
      filename: `normal-operations-report-${Date.now()}.json`,
    }

    const blob = new Blob([JSON.stringify(reportData.content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = reportData.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gasguard-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-400">Avg Gas Level</span>
            </div>
            <p className="text-2xl font-bold text-white">{normalReadings.summary.averageGasLevel}%</p>
          </CardContent>
        </Card>

        <Card className="gasguard-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-400">Week Average</span>
            </div>
            <p className="text-2xl font-bold text-white">{normalReadings.summary.lastWeekAverage}%</p>
          </CardContent>
        </Card>

        <Card className="gasguard-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-400">Peak Gas Level</span>
            </div>
            <p className="text-2xl font-bold text-white">{normalReadings.summary.peakGasLevel.toLocaleString()}</p>
          </CardContent>
        </Card>


      </div>

      <Card className="gasguard-card">
        <CardHeader>
          <CardTitle className="text-white">Daily Gas Level Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {normalReadings.dailyAverages.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 gasguard-input rounded-lg">
                <span className="text-white">{day.date}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(day.average / 10) * 100}%` }} />
                  </div>
                  <span className="text-white font-medium w-12">{day.average}%</span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={generateNormalReport} className="w-full mt-4 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Generate Normal Operations Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

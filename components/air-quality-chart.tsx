"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "@/components/ui/chart"
import { useAirQuality } from "@/context/air-quality-context"

export function AirQualityChart() {
  const { airQualityData } = useAirQuality()

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={airQualityData}>
          <XAxis dataKey="timestamp" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#32B3A8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#32B3A8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

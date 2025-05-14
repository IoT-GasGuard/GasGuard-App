"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAirQuality } from "@/context/air-quality-context"

export function AirQualityStatus() {
  const { airQuality, showAlert } = useAirQuality()

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-7xl font-bold text-center">{Math.round(airQuality)}%</div>

      {showAlert && (
        <div className="w-full max-w-md mx-auto">
          <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Air quality has dropped below 60%. Actuators have been activated and must be manually deactivated.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!showAlert && airQuality >= 60 && <div className="text-green-400 text-center">Air quality is good</div>}
    </div>
  )
}

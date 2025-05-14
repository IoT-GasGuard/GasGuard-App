"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap, Power } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAirQuality } from "@/context/air-quality-context"

interface Actuator {
  id: string
  name: string
  active: boolean
}

export function ActuatorStatus() {
  const { airQuality, actuatorsActive, setActuatorsActive, showAlert, setShowAlert, resetAirQuality } = useAirQuality()

  const [actuators, setActuators] = useState<Actuator[]>([
    { id: "act1", name: "Ventilation System", active: false },
    { id: "act2", name: "Power Shutoff Function", active: false },
  ])

  // Update actuators when global actuatorsActive state changes
  useEffect(() => {
    if (actuatorsActive) {
      setActuators((prev) => prev.map((act) => ({ ...act, active: true })))
    }
  }, [actuatorsActive])

  const handleDeactivate = (id: string) => {
    // Update the actuators state
    setActuators((prev) => {
      const updatedActuators = prev.map((act) => (act.id === id ? { ...act, active: false } : act))

      // Check if all actuators are now inactive
      const allDeactivated = updatedActuators.every((act) => !act.active)

      // If all are deactivated, clear the warning
      if (allDeactivated) {
        setActuatorsActive(false)
        setShowAlert(false)
      }

      return updatedActuators
    })
  }

  const handleDeactivateAll = () => {
    // Deactivate all actuators
    setActuators((prev) => prev.map((act) => ({ ...act, active: false })))
    setActuatorsActive(false)
    setShowAlert(false)

    // Reset air quality to 90%
    resetAirQuality()
  }

  return (
    <div className="space-y-4">
      {showAlert && (
        <Alert className="bg-amber-900/20 border-amber-800 text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some actuators were automatically activated due to poor air quality. They must be manually deactivated when
            safe.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {actuators.map((actuator) => (
          <div
            key={actuator.id}
            className={`flex items-center justify-between p-4 rounded-md ${
              actuator.active ? "bg-amber-900/10 border border-amber-800/50" : "bg-gray-800/50 border border-gray-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              {actuator.active ? (
                <Zap className="h-5 w-5 text-amber-400" />
              ) : (
                <Power className="h-5 w-5 text-green-400" />
              )}
              <div>
                <div className="font-medium">{actuator.name}</div>
                <div className="text-sm text-gray-400">{actuator.active ? "Auto-activated" : "Inactive"}</div>
              </div>
            </div>

            {actuator.active && (
              <Button
                variant="destructive"
                onClick={() => handleDeactivate(actuator.id)}
                className="bg-red-900 hover:bg-red-800"
              >
                Deactivate
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-800">
        <Button onClick={handleDeactivateAll} className="w-full bg-[#507A9E] hover:bg-[#32B3A8] text-white">
          Reset All Actuators & Air Quality
        </Button>
      </div>
    </div>
  )
}

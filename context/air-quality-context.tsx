"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

interface AirQualityContextType {
  airQuality: number
  airQualityData: Array<{ value: number; timestamp: string }>
  resetAirQuality: () => void
  actuatorsActive: boolean
  setActuatorsActive: (active: boolean) => void
  showAlert: boolean
  setShowAlert: (show: boolean) => void
}

// Default values to prevent hydration errors
const defaultAirQualityData = Array(6)
  .fill(null)
  .map((_, i) => ({
    value: 90,
    timestamp: `00:0${i}`, // Static timestamps for initial render
  }))

const AirQualityContext = createContext<AirQualityContextType>({
  airQuality: 90,
  airQualityData: defaultAirQualityData,
  resetAirQuality: () => {},
  actuatorsActive: false,
  setActuatorsActive: () => {},
  showAlert: false,
  setShowAlert: () => {},
})

export function AirQualityProvider({ children }: { children: ReactNode }) {
  // Initialize with default values to prevent hydration errors
  const [airQuality, setAirQuality] = useState(90)
  const [airQualityData, setAirQualityData] = useState(defaultAirQualityData)
  const [actuatorsActive, setActuatorsActive] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Use refs to track current values without causing re-renders
  const airQualityRef = useRef(90)
  const dataInitializedRef = useRef(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)

    // Update timestamps with real ones after hydration - only once
    if (!dataInitializedRef.current) {
      setAirQualityData((prev) =>
        prev.map((item, i) => ({
          ...item,
          timestamp: new Date(Date.now() - (5 - i) * 4000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      )
      dataInitializedRef.current = true
    }
  }, [])

  // Only run data generation on the client
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      // Get the current value from the ref
      let currentValue = airQualityRef.current

      // Decide whether to add or subtract (0 = subtract, 1 = add)
      const operation = Math.random() < 0.5 ? -1 : 1

      // Generate a random number between 1-10
      const changeAmount = Math.floor(Math.random() * 10) + 1

      // Calculate new value and ensure it stays within 0-100 range
      currentValue = Math.min(Math.max(currentValue + operation * changeAmount, 0), 100)

      // Update the ref
      airQualityRef.current = currentValue

      // Update the data array using functional update to avoid dependency on airQualityData
      setAirQualityData((prevData) => {
        const newData = [
          ...prevData,
          {
            value: currentValue,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]

        // Keep only the last 6 readings
        if (newData.length > 6) {
          return newData.slice(newData.length - 6)
        }
        return newData
      })

      // Update the current air quality value
      setAirQuality(currentValue)

      // Auto-activate actuators if air quality is below 60%
      if (currentValue < 60) {
        setActuatorsActive(true)
        setShowAlert(true)
      }
    }, 4000) // Update every 4 seconds as requested

    return () => clearInterval(interval)
  }, [isClient]) // Only depend on isClient, not on airQualityData

  // Function to reset air quality to 90%
  const resetAirQuality = () => {
    const resetValue = 90
    airQualityRef.current = resetValue
    setAirQuality(resetValue)

    // Update the last data point to 90%
    setAirQualityData((prevData) => {
      const newData = [...prevData]
      if (newData.length > 0) {
        newData[newData.length - 1] = {
          value: resetValue,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      }
      return newData
    })

    // Reset actuators and alerts
    setActuatorsActive(false)
    setShowAlert(false)
  }

  return (
    <AirQualityContext.Provider
      value={{
        airQuality,
        airQualityData,
        resetAirQuality,
        actuatorsActive,
        setActuatorsActive,
        showAlert,
        setShowAlert,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  )
}

export function useAirQuality() {
  const context = useContext(AirQualityContext)
  return context
}

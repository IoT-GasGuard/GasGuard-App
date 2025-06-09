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

const defaultAirQualityData = Array(6)
    .fill(null)
    .map((_, i) => ({
      value: Math.floor(Math.random() * 30) + 1, // Valores iniciales bajos (1-30)
      timestamp: `00:0${i}`,
    }))

const AirQualityContext = createContext<AirQualityContextType>({
  airQuality: 30,
  airQualityData: defaultAirQualityData,
  resetAirQuality: () => {},
  actuatorsActive: false,
  setActuatorsActive: () => {},
  showAlert: false,
  setShowAlert: () => {},
})

export function AirQualityProvider({ children }: { children: ReactNode }) {
  const [airQuality, setAirQuality] = useState(30)
  const [airQualityData, setAirQualityData] = useState(defaultAirQualityData)
  const [actuatorsActive, setActuatorsActive] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const airQualityRef = useRef(30)
  const dataInitializedRef = useRef(false)

  useEffect(() => {
    setIsClient(true)

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

  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      let currentValue = airQualityRef.current

      // Aumentar la probabilidad de picos altos
      const isSpike = Math.random() < 0.1
      const operation = isSpike ? 1 : Math.random() < 0.5 ? 1 : -1
      const changeAmount = isSpike
          ? Math.floor(Math.random() * 30) + 20
          : Math.floor(Math.random() * 10) + 1

      currentValue = Math.min(Math.max(currentValue + operation * changeAmount, 0), 100)

      airQualityRef.current = currentValue

      setAirQualityData((prevData) => {
        const newData = [
          ...prevData,
          {
            value: currentValue,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]

        return newData.slice(-6)
      })

      setAirQuality(currentValue)

      if (currentValue > 70) {
        setActuatorsActive(true)
        setShowAlert(true)
      } else {
        setActuatorsActive(false)
        setShowAlert(false)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isClient])

  const resetAirQuality = () => {
    const resetValue = 30
    airQualityRef.current = resetValue
    setAirQuality(resetValue)

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
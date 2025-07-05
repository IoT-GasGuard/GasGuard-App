"use client"

import { useState, useEffect, useRef } from "react"
import { Client } from "@stomp/stompjs"
import { getStompClient } from "@/lib/stompClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, Settings, Info } from "lucide-react"
import { DeviceService } from "@/public/services/device.service"
import { Loading } from "@/components/ui/loading"

interface Device {
  id: string
  name: string
  deviceId: string
  type: string
}

interface DeviceWithIntensity extends Device {
  intensity: number
}

interface SystemStatus {
  ventilationActive: boolean
  powerShutoffActive: boolean
  lightingAuto: boolean
  lightIntensity: number
}

interface LightingControlProps {
  systemStatus: SystemStatus
  setSystemStatus: (status: SystemStatus | ((prev: SystemStatus) => SystemStatus)) => void
  setAlerts: (alerts: any) => void
}

export default function LightingControl({ systemStatus, setSystemStatus, setAlerts }: LightingControlProps) {
  const [ambientLight, setAmbientLight] = useState(65)
  const [manualOverride, setManualOverride] = useState(false)
  const [devices, setDevices] = useState<DeviceWithIntensity[]>([])
  const [loadingDevices, setLoadingDevices] = useState(true)
  const stompClientRef = useRef<Client | null>(null)


  useEffect(() => {
    const client = getStompClient()
    client.onConnect = () => {
      console.log("✅ Connected to STOMP WebSocket")
    }
    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"])
      console.error("Details:", frame.body)
    }
    stompClientRef.current = client
  }, [])


  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const profileId = localStorage.getItem("profileId")
        const deviceService = new DeviceService()
        const deviceData = await deviceService.getAllDevicesByProfileId(profileId)
        const devicesWithIntensity: DeviceWithIntensity[] = deviceData.map((d: Device) => ({
          ...d,
          intensity: 50
        }))
        setDevices(devicesWithIntensity)
      } catch (error) {
        console.error("Error fetching devices:", error)
      } finally {
        setLoadingDevices(false)
      }
    }
    fetchDevices()
  }, [])


  const sendLightingCommand = (deviceId: string, value: number, automatic: boolean) => {
    const client = stompClientRef.current
    if (client && client.connected) {
      const payload = { deviceId, value, automatic }
      client.publish({
        destination: "/app/lighting",
        body: JSON.stringify(payload)
      })
      console.log("📤 Sent:", payload)
    } else {
      console.warn("STOMP not connected")
    }
  }


  const updateDeviceIntensity = (deviceId: string, newIntensity: number) => {
    setDevices(prev =>
        prev.map(dev => dev.deviceId === deviceId ? { ...dev, intensity: newIntensity } : dev)
    )
    sendLightingCommand(deviceId, newIntensity, false)
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientLight(prev => {
        const change = (Math.random() - 0.5) * 10
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    if (systemStatus.lightingAuto && !manualOverride) {
      let newIntensity = systemStatus.lightIntensity

      if (ambientLight < 30) {
        newIntensity = Math.min(100, systemStatus.lightIntensity + 5)
      } else if (ambientLight > 80) {
        newIntensity = Math.max(20, systemStatus.lightIntensity - 5)
      }

      if (newIntensity !== systemStatus.lightIntensity) {
        setSystemStatus(prev => ({ ...prev, lightIntensity: newIntensity }))
        setAlerts((prev: any) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "system",
            message: `Lighting adjusted to ${newIntensity}% due to ambient light`,
            timestamp: new Date().toLocaleString(),
            severity: "low"
          }
        ])

        // Actualiza todos los dispositivos (envía comando a cada uno)
        devices.forEach(zone => {
          sendLightingCommand(zone.deviceId, newIntensity, true)
        })
      }
    }
  }, [ambientLight, systemStatus.lightingAuto, manualOverride, systemStatus.lightIntensity, devices, setSystemStatus, setAlerts])

  const toggleAutoMode = () => {
    const newAuto = !systemStatus.lightingAuto
    setSystemStatus(prev => ({ ...prev, lightingAuto: newAuto }))
    devices.forEach(zone => {
      sendLightingCommand(zone.deviceId, systemStatus.lightIntensity, newAuto)
    })
    setAlerts((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "system",
        message: `Automatic lighting ${newAuto ? "enabled" : "disabled"}`,
        timestamp: new Date().toLocaleString(),
        severity: "low"
      }
    ])
  }


  const handleMasterIntensityChange = (value: number[]) => {
    const newIntensity = value[0]
    setManualOverride(true)
    setSystemStatus(prev => ({ ...prev, lightIntensity: newIntensity }))

    devices.forEach(zone => {
      sendLightingCommand(zone.deviceId, newIntensity, false)
    })

    setTimeout(() => {
      setManualOverride(false)
    }, 30000)
  }

  const recommendation = (() => {
    if (ambientLight < 20)
      return { text: "Very low light detected - consider increasing intensity", color: "text-yellow-400" }
    if (ambientLight < 40) return { text: "Low light conditions - automatic adjustment active", color: "text-blue-400" }
    if (ambientLight > 85) return { text: "High ambient light - reducing artificial lighting", color: "text-green-400" }
    return { text: "Optimal lighting conditions", color: "text-green-400" }
  })()

  return (
      <div className="space-y-6">
        <Alert className="bg-blue-900 border-blue-700">
          <Info className="h-4 w-4" />
          <AlertDescription className={`${recommendation.color}`}>{recommendation.text}</AlertDescription>
        </Alert>

        {manualOverride && (
            <Alert className="bg-yellow-900 border-yellow-700">
              <Settings className="h-4 w-4" />
              <AlertDescription className="text-yellow-100">
                Manual override active. Automatic adjustments will resume in 30 seconds.
              </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gasguard-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Master Lighting Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Automatic Mode</p>
                  <p className="text-sm text-gray-400">Adjust lighting based on ambient conditions</p>
                </div>
                <Switch
                    checked={systemStatus.lightingAuto}
                    onCheckedChange={toggleAutoMode}
                    className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">Master Intensity</p>
                  <Badge variant="outline" className="text-white border-gray-600">
                    {systemStatus.lightIntensity}%
                  </Badge>
                </div>
                <Slider
                    value={[systemStatus.lightIntensity]}
                    onValueChange={handleMasterIntensityChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full [&_[role=slider]]:bg-[#FFFF] [&_[role=slider]]:border-[#FFFF]"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gasguard-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Device Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingDevices ? (
                  <Loading />
              ) : (
                  devices.map(device => (
                      <div key={device.id} className="p-4 gasguard-input rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-white">{device.name}</h3>
                            <p className="text-sm text-gray-400">Intensity: {device.intensity}%</p>
                          </div>
                        </div>
                        <Slider
                            value={[device.intensity]}
                            onValueChange={value => updateDeviceIntensity(device.deviceId, value[0])}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full [&_[role=slider]]:bg-[#FFFF] [&_[role=slider]]:border-[#FFFF]"
                            disabled={systemStatus.lightingAuto}
                        />
                      </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
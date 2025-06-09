"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, Sun, Moon, Zap, Settings, Info } from "lucide-react"

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
    const [ambientLight, setAmbientLight] = useState(65) // Simulated ambient light sensor
    const [manualOverride, setManualOverride] = useState(false)
    const [lightingZones, setLightingZones] = useState([
        { id: "living-room", name: "Living Room", intensity: 75, status: "on" },
        { id: "kitchen", name: "Kitchen", intensity: 85, status: "on" },
        { id: "bedroom", name: "Bedroom", intensity: 45, status: "on" },
        { id: "bathroom", name: "Bathroom", intensity: 90, status: "on" },
    ])

    // Simulate ambient light changes
    useEffect(() => {
        const interval = setInterval(() => {
            setAmbientLight((prev) => {
                const change = (Math.random() - 0.5) * 10
                return Math.max(0, Math.min(100, prev + change))
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    // Auto-adjust lighting based on ambient light
    useEffect(() => {
        if (systemStatus.lightingAuto && !manualOverride) {
            let newIntensity = systemStatus.lightIntensity

            if (ambientLight < 30) {
                // Low ambient light - increase intensity
                newIntensity = Math.min(100, systemStatus.lightIntensity + 5)
                if (newIntensity !== systemStatus.lightIntensity) {
                    setSystemStatus((prev) => ({ ...prev, lightIntensity: newIntensity }))
                    setAlerts((prev: any) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            type: "system",
                            message: `Lighting intensity automatically increased to ${newIntensity}% due to low ambient light`,
                            timestamp: new Date().toLocaleString(),
                            severity: "low",
                        },
                    ])
                }
            } else if (ambientLight > 80) {
                // High ambient light - decrease intensity
                newIntensity = Math.max(20, systemStatus.lightIntensity - 5)
                if (newIntensity !== systemStatus.lightIntensity) {
                    setSystemStatus((prev) => ({ ...prev, lightIntensity: newIntensity }))
                    setAlerts((prev: any) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            type: "system",
                            message: `Lighting intensity automatically decreased to ${newIntensity}% due to high ambient light`,
                            timestamp: new Date().toLocaleString(),
                            severity: "low",
                        },
                    ])
                }
            }

            // Update all zones when master intensity changes
            setLightingZones((prev) =>
                prev.map((zone) => ({ ...zone, intensity: newIntensity })
                ))
        }
    }, [ambientLight, systemStatus.lightingAuto, manualOverride, systemStatus.lightIntensity])

    const toggleAutoMode = () => {
        const newAutoMode = !systemStatus.lightingAuto
        setSystemStatus((prev) => ({ ...prev, lightingAuto: newAutoMode }))

        // Reset all zones to master intensity when auto mode is toggled
        if (newAutoMode) {
            setLightingZones((prev) =>
                prev.map((zone) => ({ ...zone, intensity: systemStatus.lightIntensity }))
            )
        }

        setAlerts((prev: any) => [
            ...prev,
            {
                id: Date.now().toString(),
                type: "system",
                message: `Automatic lighting control ${newAutoMode ? "enabled" : "disabled"}`,
                timestamp: new Date().toLocaleString(),
                severity: "low",
            },
        ])
    }

    const handleMasterIntensityChange = (value: number[]) => {
        setManualOverride(true)
        const newIntensity = value[0]
        setSystemStatus((prev) => ({ ...prev, lightIntensity: newIntensity }))

        // update all zones when master intensity is changed manually
        if (systemStatus.lightingAuto) {
            setLightingZones((prev) =>
                prev.map((zone) => ({ ...zone, intensity: newIntensity }))
            )
        }

        // reset manual override after 30 seconds
        setTimeout(() => {
            setManualOverride(false)
        }, 30000)
    }

    const updateZoneIntensity = (zoneId: string, intensity: number) => {
        setLightingZones((prev) =>
            prev.map((zone) => (zone.id === zoneId ? { ...zone, intensity } : zone))
        )
    }

    const getLightingRecommendation = () => {
        if (ambientLight < 20)
            return { text: "Very low light detected - consider increasing intensity", color: "text-yellow-400" }
        if (ambientLight < 40) return { text: "Low light conditions - automatic adjustment active", color: "text-blue-400" }
        if (ambientLight > 85) return { text: "High ambient light - reducing artificial lighting", color: "text-green-400" }
        return { text: "Optimal lighting conditions", color: "text-green-400" }
    }

    const recommendation = getLightingRecommendation()

    return (
        <div className="space-y-6">
            {/* System Status Alert */}
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
                {/* Master Control */}
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

                {/* Zone Control */}
                <Card className="gasguard-card">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Zone Control
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {lightingZones.map((zone) => (
                            <div key={zone.id} className="p-4 gasguard-input rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-medium text-white">{zone.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            {systemStatus.lightingAuto ? "Auto Mode" : "Manual Mode"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Intensity</span>
                                        <span className="text-sm text-white">{zone.intensity}%</span>
                                    </div>
                                    <Slider
                                        value={[zone.intensity]}
                                        onValueChange={(value) => updateZoneIntensity(zone.id, value[0])}
                                        max={100}
                                        min={0}
                                        step={5}
                                        className="w-full [&_[role=slider]]:bg-[#FFFF] [&_[role=slider]]:border-[#FFFF]"
                                        disabled={systemStatus.lightingAuto}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
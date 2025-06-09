"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, AlertTriangle, CheckCircle, Hash } from "lucide-react"

interface Device {
  id: string
  name: string
  status: "online" | "offline" | "alert"
  lastReading: string
  gasLevel: number
  location: string
}

interface DeviceManagementProps {
  devices: Device[]
  setDevices: (devices: Device[]) => void
  setAlerts: (alerts: any) => void
}

export default function DeviceManagement({ devices, setDevices, setAlerts }: DeviceManagementProps) {
  const [newDevice, setNewDevice] = useState({ id: "", name: "", location: "" })
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [showSuccess, setShowSuccess] = useState("")
  const [showError, setShowError] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const validateDevice = (device: { id: string; name: string; location?: string }) => {
    if (!device.id.trim()) return "Device ID is required"
    if (!device.name.trim()) return "Device name is required"
    if (device.id.length < 3) return "Device ID must be at least 3 characters"
    if (device.name.length < 2) return "Device name must be at least 2 characters"
    if (!/^[A-Z0-9]+$/.test(device.id)) return "Device ID must contain only uppercase letters and numbers"
    return null
  }

  const handlePairDevice = () => {
    const error = validateDevice(newDevice)
    if (error) {
      setShowError(error)
      setTimeout(() => setShowError(""), 3000)
      return
    }

    // Check if device ID already exists
    if (devices.some((d) => d.id === newDevice.id)) {
      setShowError("Device ID already exists")
      setTimeout(() => setShowError(""), 3000)
      return
    }

    const device: Device = {
      id: newDevice.id,
      name: newDevice.name,
      status: "online",
      lastReading: "Just now",
      gasLevel: Math.floor(Math.random() * 10) + 2,
      location: newDevice.location || "Unknown",
    }

    setDevices([...devices, device])
    setNewDevice({ id: "", name: "", location: "" })
    setShowSuccess("Device paired successfully!")

    setAlerts((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "device",
        message: `Device "${device.name}" has been successfully paired and is now online`,
        timestamp: new Date().toLocaleString(),
        severity: "low",
      },
    ])

    setTimeout(() => setShowSuccess(""), 3000)
  }

  const handleEditDevice = () => {
    if (!editingDevice) return

    const error = validateDevice(editingDevice)
    if (error) {
      setShowError(error)
      setTimeout(() => setShowError(""), 3000)
      return
    }

    // Check if new ID conflicts with existing devices (excluding current device)
    if (devices.some((d) => d.id === editingDevice.id && d.id !== editingDevice.id)) {
      setShowError("Device ID already exists")
      setTimeout(() => setShowError(""), 3000)
      return
    }

    setDevices(devices.map((d) => (d.id === editingDevice.id ? editingDevice : d)))

    setShowSuccess("Device updated successfully!")
    setIsEditDialogOpen(false)
    setEditingDevice(null)

    setAlerts((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "device",
        message: `Device "${editingDevice.name}" has been updated successfully`,
        timestamp: new Date().toLocaleString(),
        severity: "low",
      },
    ])

    setTimeout(() => setShowSuccess(""), 3000)
  }

  const handleDeleteDevice = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    // Check if device has active alerts (high gas levels)
    if (device.gasLevel > 50 || device.status === "alert") {
      setShowError("Cannot delete device with active alerts. Please resolve all issues first.")
      setTimeout(() => setShowError(""), 5000)
      return
    }

    setDevices(devices.filter((d) => d.id !== deviceId))
    setShowSuccess(`Device "${device.name}" has been successfully removed`)

    setAlerts((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "device",
        message: `Device "${device.name}" has been disconnected from the system`,
        timestamp: new Date().toLocaleString(),
        severity: "low",
      },
    ])

    setTimeout(() => setShowSuccess(""), 3000)
  }

  return (
      <div className="space-y-6">
        {/* Success/Error Messages */}
        {showSuccess && (
            <Alert className="bg-green-900 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-100">{showSuccess}</AlertDescription>
            </Alert>
        )}

        {showError && (
            <Alert className="bg-red-900 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-100">{showError}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pair New Device */}
          <Card className="gasguard-card">
            <CardHeader>
              <CardTitle className="text-white">Pair New Device</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device-id" className="text-white">
                  Device ID
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                      id="device-id"
                      placeholder="Enter device ID"
                      value={newDevice.id}
                      onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value.toUpperCase() })}
                      className="pl-10 gasguard-input text-white border-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="device-name" className="text-white">
                  Device Name
                </Label>
                <Input
                    id="device-name"
                    placeholder="Enter a name for this device"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="gasguard-input text-white border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="device-location" className="text-white">
                  Location (Optional)
                </Label>
                <Input
                    id="device-location"
                    placeholder="e.g., Living Room, Kitchen"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                    className="gasguard-input text-white border-0"
                />
              </div>

              <Button
                  onClick={handlePairDevice}
                  className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-black font-medium border-0"
                  disabled={!newDevice.id || !newDevice.name}
              >
                Pair Device
              </Button>
            </CardContent>
          </Card>

          {/* Your Devices */}
          <Card className="gasguard-card">
            <CardHeader>
              <CardTitle className="text-white">Your Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No devices paired yet</p>
              ) : (
                  <div className="space-y-3">
                    {devices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-4 gasguard-input rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#00D4AA]" />
                            <div>
                              <h3 className="font-medium text-white">{device.name}</h3>
                              <p className="text-sm text-gray-400">Last seen: {device.lastReading}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingDevice(device)}
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="gasguard-card">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Edit Device</DialogTitle>
                                </DialogHeader>
                                {editingDevice && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label className="text-white">Device ID</Label>
                                        <Input
                                            value={editingDevice.id}
                                            onChange={(e) =>
                                                setEditingDevice({
                                                  ...editingDevice,
                                                  id: e.target.value.toUpperCase(),
                                                })
                                            }
                                            className="gasguard-input text-white border-0"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-white">Device Name</Label>
                                        <Input
                                            value={editingDevice.name}
                                            onChange={(e) =>
                                                setEditingDevice({
                                                  ...editingDevice,
                                                  name: e.target.value,
                                                })
                                            }
                                            className="gasguard-input text-white border-0"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-white">Location</Label>
                                        <Input
                                            value={editingDevice.location}
                                            onChange={(e) =>
                                                setEditingDevice({
                                                  ...editingDevice,
                                                  location: e.target.value,
                                                })
                                            }
                                            className="gasguard-input text-white border-0"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                            onClick={handleEditDevice}
                                            className="flex-1 bg-[#00D4AA] hover:bg-[#00B894] text-black border-0"
                                        >
                                          Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                              setIsEditDialogOpen(false)
                                              setEditingDevice(null)
                                            }}
                                            className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDevice(device.id)}
                                className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { QrCode, Trash2 } from "lucide-react"

interface Device {
  id: string
  name: string
  lastData: string
  state: string
}

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "dev1", name: "Living Room Sensor", state:"Online", lastData: "2 minutes ago" },
  ])

  const [deviceId, setDeviceId] = useState("")
  const [deviceName, setDeviceName] = useState("")

  const handlePairDevice = () => {
    if (!deviceId || !deviceName) return

    const newDevice: Device = {
      id: deviceId,
      name: deviceName,
      lastData: "Just now",
      state:"Online",
    }

    setDevices([...devices, newDevice])
    setDeviceId("")
    setDeviceName("")
  }

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Pair New Device</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-id">Device ID</Label>
              <div className="flex">
                <Input
                    id="device-id"
                    placeholder="Enter device ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                />
                <Button variant="outline" size="icon" className="ml-2">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                  id="device-name"
                  placeholder="Enter a name for this device"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="bg-gray-800 border-gray-700"
              />
            </div>

            <Button
                onClick={handlePairDevice}
                className="w-full bg-[#32B3A8] hover:bg-[#507A9E] text-white"
                disabled={!deviceId || !deviceName}
            >
              Pair Device
            </Button>
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your Devices</h2>

          {devices.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No devices paired yet</div>
          ) : (
              <div className="space-y-3">
                {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-400">State: {device.state}</div>
                          <div className="text-sm text-gray-400">Last seen: {device.lastData}</div>

                        </div>
                      </div>

                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDevice(device.id)}>
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  )
}

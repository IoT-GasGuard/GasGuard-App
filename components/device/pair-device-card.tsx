import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hash } from "lucide-react"

interface NewDevice {
    deviceId: string
    name: string
    location: string
}

interface PairDeviceCardProps {
    newDevice: NewDevice
    setNewDevice: (device: NewDevice) => void
    handlePairDevice: () => void
}

export default function PairDeviceCard({
                                           newDevice,
                                           setNewDevice,
                                           handlePairDevice,
                                       }: PairDeviceCardProps) {
    return (
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
                            value={newDevice.deviceId}
                            onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })}
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
                    disabled={!newDevice.deviceId || !newDevice.name}
                >
                    Pair Device
                </Button>
            </CardContent>
        </Card>
    )
}
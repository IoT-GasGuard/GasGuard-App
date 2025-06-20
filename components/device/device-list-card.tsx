import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Device} from "@/shared/device.model";
import DeviceItem from "./device-item"
import EditDeviceDialog from "./edit-device-dialog"

interface DeviceListCardProps {
    devices: Device[]
    editingDevice: Device | null
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    setEditingDevice: (device: Device | null) => void
    handleEditDevice: () => void
    handleDeleteDevice: (deviceId: string) => void
    handleEditingDeviceChange: (field: string, value: string) => void
}

export default function DeviceListCard({
                                           devices,
                                           editingDevice,
                                           isEditDialogOpen,
                                           setIsEditDialogOpen,
                                           setEditingDevice,
                                           handleEditDevice,
                                           handleDeleteDevice,
                                           handleEditingDeviceChange,
                                       }: DeviceListCardProps) {
    return (
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
                            <DeviceItem
                                key={device.id}
                                device={device}
                                onEdit={setEditingDevice}
                                onDelete={handleDeleteDevice}
                            />
                        ))}
                    </div>
                )}
                <EditDeviceDialog
                    device={editingDevice}
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleEditDevice}
                    onCancel={() => {
                        setIsEditDialogOpen(false)
                        setEditingDevice(null)
                    }}
                    onChange={handleEditingDeviceChange}
                />
            </CardContent>
        </Card>
    )
}
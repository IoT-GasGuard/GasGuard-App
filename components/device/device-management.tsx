"use client"

import { useEffect, useState } from "react"
import { DeviceService } from "@/public/services/device.service"
import PairDeviceCard from "./pair-device-card"
import DeviceListCard from "./device-list-card"
import AlertMessage from "./alert-message"
import { Device } from "@/shared/device.model"

interface DeviceManagementProps {
    devices: Device[]
    setDevices: (devices: Device[]) => void
    setAlerts: (alerts: any) => void
}

export default function DeviceManagement({ devices, setDevices, setAlerts }: DeviceManagementProps) {
    const [newDevice, setNewDevice] = useState({ deviceId: "", name: "", location: "" })
    const [editingDevice, setEditingDevice] = useState<Device | null>(null)
    const [showSuccess, setShowSuccess] = useState("")
    const [showError, setShowError] = useState("")
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const deviceService = new DeviceService()
    const profileId = localStorage.getItem("profileId")

    const validateDevice = (device: { deviceId: string; name: string; location?: string }) => {
        if (!device.deviceId.trim()) return "Device ID is required"
        if (!device.name.trim()) return "Device name is required"
        if (device.deviceId.length < 3) return "Device ID must be at least 3 characters"
        if (device.name.length < 2) return "Device name must be at least 2 characters"
        return null
    }

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setIsLoading(true)
                const devicesFromApi = await deviceService.getAllDevicesByProfileId(profileId)
                setDevices(devicesFromApi)
            } catch (error) {
                console.error("Error cargando dispositivos:", error)
                setShowError("Error loading devices. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchDevices()
    }, [])

    const handlePairDevice = async () => {
        const error = validateDevice(newDevice)
        if (error) {
            setShowError(error)
            setTimeout(() => setShowError(""), 3000)
            return
        }

        if (devices.some((d) => d.deviceId === newDevice.deviceId)) {
            setShowError("Device ID already exists")
            setTimeout(() => setShowError(""), 3000)
            return
        }

        try {
            await deviceService.createDevice({
                deviceId: newDevice.deviceId,
                name: newDevice.name,
                location: newDevice.location,
                profileId: profileId,
            })

            const updatedDeviceList = await deviceService.getAllDevicesByProfileId(profileId)
            setDevices(updatedDeviceList)
            setShowSuccess("Device paired successfully!")
            setNewDevice({ deviceId: "", name: "", location: "" })
        } catch (error) {
            setShowError("Error pairing device. Please try again.")
            console.error(error)
        }
    }

    const handleEditDevice = async () => {
        if (!editingDevice) return

        const error = validateDevice(editingDevice)
        if (error) {
            setShowError(error)
            setTimeout(() => setShowError(""), 3000)
            return
        }

        try {
            await deviceService.updateDevice(editingDevice.id, editingDevice)
            const updatedDeviceList = await deviceService.getAllDevicesByProfileId(profileId)
            setDevices(updatedDeviceList)

            setShowSuccess("Device updated successfully!")
            setIsEditDialogOpen(false)
            setEditingDevice(null)
        } catch (error) {
            setShowError("Error updating device. Please try again.")
            console.error(error)
        }
    }

    const handleDeleteDevice = async (deviceId: string) => {
        const device = devices.find((d) => d.id === deviceId)
        if (!device) return

        if (device.gasLevel > 71) {
            setShowError("Cannot delete device with active alerts. Please resolve all issues first.")
            setTimeout(() => setShowError(""), 5000)
            return
        }

        try {
            await deviceService.deleteDevice(deviceId)
            const updatedDeviceList = await deviceService.getAllDevicesByProfileId(profileId)
            setDevices(updatedDeviceList)
            setShowSuccess(`Device "${device.name}" deleted successfully`)
        } catch (error) {
            setShowError("Error deleting device. Please try again.")
            console.error(error)
        }
        setTimeout(() => setShowSuccess(""), 3000)
    }

    const handleEditingDeviceChange = (field: string, value: string) => {
        if (editingDevice) {
            setEditingDevice({
                ...editingDevice,
                [field]: value,
            })
        }
    }

    const handleEditButtonClick = (device: Device | null) => {
        setEditingDevice(device)
        if (device !== null) {
            setIsEditDialogOpen(true)
        }
    }

    return (
        <div className="space-y-6">
            <AlertMessage message={showSuccess} type="success" />
            <AlertMessage message={showError} type="error" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PairDeviceCard
                    newDevice={newDevice}
                    setNewDevice={setNewDevice}
                    handlePairDevice={handlePairDevice}
                />

                <DeviceListCard
                    devices={devices}
                    isLoading={isLoading}
                    editingDevice={editingDevice}
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setEditingDevice={handleEditButtonClick}
                    handleEditDevice={handleEditDevice}
                    handleDeleteDevice={handleDeleteDevice}
                    handleEditingDeviceChange={handleEditingDeviceChange}
                />
            </div>
        </div>
    )
}
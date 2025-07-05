import axios from "axios";
import environment from "../../environment/environment";

const http = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return axios.create({
        baseURL: environment.baseUrl,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

export class DeviceService {

    async createDevice(deviceData){
        try{
            const response = await http().post('/devices', deviceData);
            return response.data;

        }catch(error){
            console.error("Error al crear un nuevo dispositivo:",error);
            throw error;
        }
    }

    async deleteDevice(deviceId){
        try{
            const response = await http().delete(`/devices/${deviceId}`);
            return response.data;

        }catch(error){
            console.error("Error al crear un device:",error);
            throw error;
        }
    }

    async updateDevice(deviceId, deviceData){
        try{
            const response = await http().patch(`/devices/${deviceId}`, deviceData);
            return response.data;
        }catch(error){
            console.error("Error al actualizar un dispositivo:",error);
            throw error;
        }
    }

    async getAllDevicesByProfileId(profileId){
        try{
            const response = await http().get(`/devices/profile/${profileId}`);
            return response.data;

        }catch (error){
            console.error("Error al obtener los dispositivos del perfil:", error);
            throw error;

        }
    }
}
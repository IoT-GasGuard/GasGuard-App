import axios from "axios";
import environment from "../../environment/environment";

const http = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: environment.baseUrl,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}


export class ReportService {

    async getReportByDeviceId(deviceId) {
        try {
            const response = await http().get(`/reports/device/${deviceId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el reporte del dispositivo:", error);
            throw error;
        }
    }

}
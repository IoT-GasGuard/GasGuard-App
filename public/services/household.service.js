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

export class HouseholdService {

    async createHouseholdMember(householdMemberData) {
        try {
            const response = await http().post('/contacts', householdMemberData);
            return response.data;
        } catch (error) {
            console.error("Error al crear un nuevo miembro del hogar:", error);
            throw error;
        }
    }

    async getHouseholdMembersByProfileId (profileId) {
        try {
            const response = await http().get(`/contacts/profile/${profileId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener los miembros del hogar:", error);
            throw error;
        }
    }


    async updateHouseholdMember(profileId, householdMemberData) {
        try {
            const response = await http().patch(`/contacts/${profileId}`, householdMemberData);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar miembro del hogar:", error);
            throw error;
        }
    }


    async deleteHouseholdMember(profileId) {
        try {
            const response = await http().delete(`/contacts/${profileId}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar miembro del hogar:", error);
            throw error;
        }
    }

}

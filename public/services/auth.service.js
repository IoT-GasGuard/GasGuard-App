import axios from "axios";
import environment from "../../environment/environment";

const http = () =>{
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return axios.create({
        baseURL: environment.baseUrl,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export class AuthService {

    async authenticate(email, password) {
        try {
            const response = await http().post('/auth/sign-in', {
                email,
                password
            });
            const { token, profileId } = response.data;


            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('profileId', profileId);

            return response.data;
        } catch (error) {
            console.error('Error en la autenticación:', error);
            throw error;
        }
    }

    async registerUser(user) {
        const response = await http().post('/auth/sign-up', {
            email: user.email,
            password: user.password
        });
        return response.data;
    }


}
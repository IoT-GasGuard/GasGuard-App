import axios from "axios";
import environment from "../../environment/environment";

const http = () =>{
    const token = localStorage.getItem('token');
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
            const { token } = response.data;

            // Guarda el token en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
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
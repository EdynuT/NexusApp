import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Exemplo de tipo User (ajuste conforme sua aplicação)
export interface User {
    id: string;
    email: string;
    name?: string;
    // outros campos...
}

export const register = async (userData: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}register`, userData);
    return response.data;
};

export const login = async (userData: { email: string; password: string }): Promise<User> => {
    const response = await axios.post(`${API_URL}login`, userData);
    return response.data as User;
};

export const logout = (): void => {
    localStorage.removeItem('user');
}; 

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export default { login, logout, getCurrentUser };
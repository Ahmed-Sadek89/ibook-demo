import axios from "axios";

export const apiClient = axios.create({
    baseURL: 'https://emicrolearn.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
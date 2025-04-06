"use server";
import { apiClient } from "../Utils/axios";

export const getStudentCountry = async () => {

    try {
        const response = await apiClient.get(`/crm/countries/149?lang=ar`);
        return response.data

    } catch (error) {
        console.error(`Unexpected Error: ${error}`)
    }
};
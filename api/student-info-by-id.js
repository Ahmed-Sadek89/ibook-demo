"use server";
import { apiClient } from "../Utils/axios";
import { getCookie } from "../Utils/get-cookie-server";

export const getSudentInfoById = async (id) => {
    const cookie = await getCookie("ibook-auth")
    try {
        const response = await apiClient.get(
            `/crm/parents/students/${id}?lang=ar`,
            {
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            }
        )

        return response.data

    } catch (error) {
        console.error(`Unexpected Error: ${error}`)
    }
};
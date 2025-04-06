"use client";
import { apiClient } from "../Utils/axios";

export const getSchoolClassByLevelId = async (level_id) => {

    try {
        const response = await apiClient.get(`/crm/school_classes?lang=ar&level_id=${level_id}`);

        return response.data

    } catch (error) {
        console.error(`Unexpected Error: ${error}`)
    }
};
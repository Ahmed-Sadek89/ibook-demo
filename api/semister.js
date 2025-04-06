"use server";
import { apiClient } from "../Utils/axios";

export const getSemister = async () => {
  try {
    const response = await apiClient.get(`/crm/semesters?lang=ar`);
    return response.data;
  } catch (error) {
    console.error(`Unexpected Error: ${error}`);
  }
};

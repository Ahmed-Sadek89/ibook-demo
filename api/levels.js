"use server";
import { apiClient } from "../Utils/axios";

export const getLevels = async () => {
  try {
    const response = await apiClient.get("/crm/levels?lang=ar");
    return response.data;
  } catch (error) {
    console.error("Error fetching levels", error);
    return [];
  }
};

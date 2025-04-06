"use server";
import { apiClient } from "../Utils/axios";

export const getBooks = async (levelId, semesterId) => {
  try {
    const response = await apiClient.get(
      `/crm/books?lang=ar&semester_id=${semesterId}&level_id=${levelId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching books", error);
    return { books: [] };
  }
};

"use server";
import { apiClient } from "../Utils/axios";

export const getBookByStudentId = async (id) => {
    try {
        const response = await apiClient.get(
            `/crm/books/get_book_by_student/${id}?lang=ar`
        )

        return response.data

    } catch (error) {
        console.error(`Unexpected Error: ${error}`)
    }
};

export const getBookByStudentDetails = async (userData) => {
  try {
    
    const response = await apiClient.get(
      `/crm/books/get_book_by_student/${userData.id}?lang=ar&level_id=${userData.level_id}&semester_id=${userData.semester_id}`
    )
    
    return response.data
  } catch (error) {
    console.error(`Unexpected Error: ${error}`)
  }
}
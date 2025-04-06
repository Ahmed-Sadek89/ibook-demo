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
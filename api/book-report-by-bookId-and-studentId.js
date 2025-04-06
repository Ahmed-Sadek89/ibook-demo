"use client";
import Cookies from "universal-cookie";

export const getBookReportByStudentIdAndBookId = async (studentId, bookId) => {
    const cookie = new Cookies()
    const token = cookie.get("ibook-auth")
    try {
        const response = await apiClient.get(`/crm/parents/students/reports/book_reports/${studentId}?selected_book_id=${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data

    } catch (error) {
        console.error(`Unexpected Error: ${error}`)
    }
};
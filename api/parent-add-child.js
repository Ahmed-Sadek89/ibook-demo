"use server";
import { apiClient } from "../Utils/axios";
import { getCookie } from "../Utils/get-cookie-server";

export const addStudentsOfParent = async () => {
  const cookie = await getCookie("ibook-auth")
  try {
    const response = await apiClient.get(`/crm/parents/students/add_student/check?lang=ar`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });

    return response.data

  } catch (error) {
    console.error(`Unexpected Error: ${error}`)
  }
};
"use client";
import { apiClient } from "../Utils/axios";

export const login = async (type, body) => {

  try {
    const response = await apiClient
      .post(`/crm/${type}/auth/login?lang=ar`, body)
    return response.data

  } catch (error) {
    console.error(`Unexpected Error: ${error}`)
  }
};
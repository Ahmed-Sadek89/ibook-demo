import { apiClient } from "../Utils/axios";

export const getHomeServices = async () => {
  try {
    const response = await apiClient.get("/website/info?lang=ar");
    return response.data.details.app_links;
  } catch (error) {
    console.error("Error fetching home services", error);
    return [];
  }
};

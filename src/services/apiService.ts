// src/services/apiService.ts
import axios from "axios"; 
import { useSnackbar } from "../contexts/SnackbarContext";

const FRIENDLY_MESSAGES: Record<number | string, string> = {
  400: "There seems to be an issue with your request. Please check and try again.",
  401: "You’re not authorized. Please log in again.",
  403: "You don’t have permission to perform this action.",
  404: "We couldn’t find what you’re looking for.",
  408: "The request took too long. Please try again.",
  500: "Something went wrong on our end. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://your-api.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error: any, showSnackbar: (msg: string, type?: any) => void) => {
  let message = "";

  if (error.response) {
    const status = error.response.status;
    message = FRIENDLY_MESSAGES[status] || `Error ${status}: Please try again.`;
  } else if (error.request) {
    message = FRIENDLY_MESSAGES["NETWORK_ERROR"];
  } else {
    message = FRIENDLY_MESSAGES["UNKNOWN"];
  }

  showSnackbar(message, "error");
  throw error; 
};

export const useApiService = () => {
  const { showSnackbar } = useSnackbar();

  const get = async <T>(url: string, params?: object): Promise<T> => {
    try {
      const { data } = await api.get<T>(url, { params });
      return data;
    } catch (error) {
      handleError(error, showSnackbar);
      throw error;
    }
  };

  const post = async <T>(url: string, body?: object): Promise<T> => {
    try {
      const { data } = await api.post<T>(url, body);
      return data;
    } catch (error) {
      handleError(error, showSnackbar);
      throw error;
    }
  };

  const put = async <T>(url: string, body?: object): Promise<T> => {
    try {
      const { data } = await api.put<T>(url, body);
      return data;
    } catch (error) {
      handleError(error, showSnackbar);
      throw error;
    }
  };

  const del = async <T>(url: string): Promise<T> => {
    try {
      const { data } = await api.delete<T>(url);
      return data;
    } catch (error) {
      handleError(error, showSnackbar);
      throw error;
    }
  };

  return { get, post, put, del };
};

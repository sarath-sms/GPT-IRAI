// apps/web/utils/apiHandler.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:4000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token if exists
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

const extractError = (err: any) => {
  return (
    err?.response?.data?.msg ||
    err?.response?.data?.message ||
    err?.message ||
    "Network error"
  );
};

export const apiHandler = {
  async get(url: string, params?: any) {
    try {
      const res = await apiClient.get(url, { params });
      return res.data;
    } catch (err: any) {
      throw extractError(err);
    }
  },

  async post(url: string, data?: any) {
    try {
      const res = await apiClient.post(url, data);
      return res.data;
    } catch (err: any) {
      throw extractError(err);
    }
  },

  async put(url: string, data?: any) {
    try {
      const res = await apiClient.put(url, data);
      return res.data;
    } catch (err: any) {
      throw extractError(err);
    }
  },

  async patch(url: string, data?: any) {
    try {
      const res = await apiClient.patch(url, data);
      return res.data;
    } catch (err: any) {
      throw extractError(err);
    }
  },

  async del(url: string) {
    try {
      const res = await apiClient.delete(url);
      return res.data;
    } catch (err: any) {
      throw extractError(err);
    }
  },
};

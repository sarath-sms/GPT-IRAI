import { apiClient } from "./apiClient";

// 🧩 Generic safe API caller
export const apiHandler = {
  async get(url: string, withAuth = true) {
    try {
      const res = await apiClient.get(url, { headers: withAuth ? {} : {} });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.msg || "Network error";
    }
  },

  async post(url: string, data = {}, withAuth = true) {
    try {
      const res = await apiClient.post(url, data, { headers: withAuth ? {} : {} });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.msg || "Network error";
    }
  },

  async put(url: string, data = {}, withAuth = true) {
    try {
      const res = await apiClient.put(url, data, { headers: withAuth ? {} : {} });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.msg || "Network error";
    }
  },

  async patch(url: string, data = {}, withAuth = true) {
    try {
      const res = await apiClient.patch(url, data, { headers: withAuth ? {} : {} });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.msg || "Network error";
    }
  },

  async del(url: string, withAuth = true) {
    try {
      const res = await apiClient.delete(url, { headers: withAuth ? {} : {} });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.msg || "Network error";
    }
  },
};

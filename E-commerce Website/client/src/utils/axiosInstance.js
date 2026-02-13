import axios from "axios";

// Create the main instance
const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;

    // if refreshing of token fails, break the loop
    if (originalRequest.url.includes("/auth/refresh") && status === 401) {
      window.location.href = "/auth/login";
      return Promise.reject(err);
    }

    // 🔄 2. 401 ERROR (TOKEN EXPIRED) - TRY REFRESH
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return axiosApi(originalRequest);
      } catch (err) {
        window.location.href = "/auth/login";
      }
    }

    if (status === 403) {
      window.location.href = "/"; 
      return Promise.reject(err);
    }
  },
);

export default axiosApi;

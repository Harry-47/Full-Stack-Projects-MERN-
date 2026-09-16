import axios from "axios";

const axiosApi = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});


axiosApi.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response ? err.response.status : null;

    // 🛑 if request of refresh token is giving 401, just redirect to login page
    if (originalRequest && originalRequest.url && originalRequest.url.includes("auth/refresh")) {
      window.location.href = "/auth/login";
      return Promise.reject(err);
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosApi.post('auth/refresh');
        return axiosApi(originalRequest);
      } catch (refreshErr) {
        window.location.href = "/auth/login";
        return Promise.reject(refreshErr);
      }
    }

    if (status === 403) {
      window.location.href = "/"; 
      return Promise.reject(err);
    }

    return Promise.reject(err);
  },
);

export default axiosApi;

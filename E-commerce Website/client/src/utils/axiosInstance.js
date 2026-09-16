import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://e-commerce-website-n2cw.onrender.com/api/v1",
  withCredentials: true,
});


axiosApi.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response ? err.response.status : null;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosApi.post('auth/refresh');
        return axiosApi(originalRequest);
      } catch (err) {
        window.location.href = "/auth/login";
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

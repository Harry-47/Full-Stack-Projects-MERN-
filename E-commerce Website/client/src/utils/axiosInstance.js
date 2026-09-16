import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://e-commerce-website-n2cw.onrender.com", //only domain
  withCredentials: true,
});

// auto appends /api/v1
axiosApi.interceptors.request.use((config) => {
  if (!config.url.startsWith('/api/v1')) {
    config.url = `/api/v1${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }
  return config;
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;

    if (originalRequest.url.includes("/auth/refresh") && status === 401) {
      window.location.href = "/auth/login";
      return Promise.reject(err);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosApi.post('/auth/refresh');
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

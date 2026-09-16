import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://e-commerce-website-n2cw.onrender.com", //only domain
  withCredentials: true,
});

// auto appends /api/v1 safely without double slashes
axiosApi.interceptors.request.use((config) => {
  // Ensure url is a string and handle leading slashes safely
  let cleanUrl = config.url || '';
  
  if (!cleanUrl.startsWith('/api/v1')) {
    // Remove leading slash if present to prevent double slash with /api/v1
    if (cleanUrl.startsWith('/')) {
      cleanUrl = cleanUrl.substring(1);
    }
    config.url = `/api/v1/${cleanUrl}`;
  }
  return config;
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    // Safe check for status to prevent crashing if response is undefined
    const status = err.response ? err.response.status : null;

    if (originalRequest && originalRequest.url && originalRequest.url.includes("/auth/refresh") && status === 401) {
      window.location.href = "/auth/login";
      return Promise.reject(err);
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
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

import axiosApi from "../../../../utils/axiosInstance";

export const createProductApi = async (data, onProgress) => {
    return await axiosApi.post('/admin/products/new', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (onProgress) onProgress(percent);
        },
    });
};
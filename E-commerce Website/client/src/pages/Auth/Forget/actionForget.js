import axiosApi from 'axios' 
 
 const forgotPasswordApi = async (email) => {
    const response= await axiosApi.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {email});

    if (!response.status == 200) {
        throw new Error(data.message || 'Something went wrong while sending the reset link.');
    }

    return response.data;
};
export default forgotPasswordApi;
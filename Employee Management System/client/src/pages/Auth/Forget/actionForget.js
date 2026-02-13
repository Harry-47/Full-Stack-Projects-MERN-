import axiosApi from '../../../utils/axiosInstance';
 
 const forgotPasswordApi = async (email) => {
    const response= await axiosApi.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {email});

    if (!response.status == 200) {
        return msg = response.data?.msg ||  'Something went wrong while sending the reset link.';
    }

    return response.data.msg;
};
export default forgotPasswordApi;
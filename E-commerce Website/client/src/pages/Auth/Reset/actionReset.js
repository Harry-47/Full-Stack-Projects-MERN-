import axiosApi from "../../../utils/axiosInstance";


 const resetPasswordApi = async (token, newPassword) => {
    
    const response = await axiosApi.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {newPassword});

    const {data} = response;

    if (!response.status === 200) {
        throw new Error(data.message || 'Something went wrong while resetting the password.');
    }

    return data;
}
export default resetPasswordApi;
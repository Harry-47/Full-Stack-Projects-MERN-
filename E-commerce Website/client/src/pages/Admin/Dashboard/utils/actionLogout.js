import axiosApi from '../../../../utils/axiosInstance';

const logout = async () => {
    try {
        // Call the server logout endpoint using axios instance
        await axiosApi.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export default logout;
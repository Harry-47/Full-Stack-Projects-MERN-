import axiosApi from '../../../../utils/axiosInstance';

export const fetchDashboardData = async () => {
    const { data } = await axiosApi.get('/admin/dashboard');
    return data;
};

export const logoutApi = async () => {
    return await axiosApi.post('/auth/logout');
};
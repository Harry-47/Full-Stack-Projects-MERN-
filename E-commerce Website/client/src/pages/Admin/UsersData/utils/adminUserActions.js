import axiosApi from '../../../../utils/axiosInstance';

// Fetch users with optional search keyword
export const fetchUsers = async (keyword = "") => {
    const endpoint = keyword 
        ? `/admin/users/search?keyword=${encodeURIComponent(keyword)}`
        : '/admin/users';
    const { data } = await axiosApi.get(endpoint);
    return data;
};

// Delete user by email
export const deleteUserApi = async (email) => {
    return await axiosApi.delete('/admin/users/delete', { 
        data: { data: email } 
    });
};
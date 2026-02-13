import axiosApi from '../../../../utils/axiosInstance';

export const fetchAdminCategoryProducts = async (category, filters) => {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = category 
        ? `/admin/products/categories/${category}?${queryString}` 
        : `/admin/products/search?${queryString}`;
      
    const { data } = await axiosApi.get(endpoint);
    return data;
};
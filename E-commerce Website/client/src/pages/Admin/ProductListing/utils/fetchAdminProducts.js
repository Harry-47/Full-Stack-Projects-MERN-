import axiosApi from '../../../../utils/axiosInstance';

export const fetchAdminProducts = async () => {
    const { data } = await axiosApi.get('/admin/products');

    const grouped = {};
    data.forEach((product) => {
        if (!grouped[product.category]) grouped[product.category] = [];
        grouped[product.category].push(product);
    });

    return Object.entries(grouped)
        .slice(0, 5)
        .map(([category, products]) => ({
            category,
            products: products.slice(0, 10),
        }));
};
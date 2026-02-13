import axiosApi from '../../../../utils/axiosInstance';
import { queryClient } from '../../../../main'; 

const loadAdminProductDetails = async ({ params }) => {
    const { id } = params;

    await queryClient.prefetchQuery({
        queryKey: ['admin', 'product', id],
        queryFn: async () => {
            const { data } = await axiosApi.get(`/admin/products/edit/${id}`);
            return data;
        }
    });

    return { id };
};

export default loadAdminProductDetails;
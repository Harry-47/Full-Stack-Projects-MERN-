import { queryClient } from '../../../../main'; 
import { fetchAdminProducts } from "./fetchAdminProducts";

export const AdminProductListingLoader = async () => {
    try {
        
        await queryClient.prefetchQuery({
            queryKey: ['admin', 'products', 'listing'],
            queryFn: fetchAdminProducts,
        });
        return null; 
    } catch (error) {
        throw new Response('Error loading product listing', { status: 500 });
    }
};

export default AdminProductListingLoader;
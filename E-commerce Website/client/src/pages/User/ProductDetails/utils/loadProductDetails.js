import { queryClient } from '../../../../main'; 
import fetchFn from './fetchFn'

const loadProductDetails = async ({ params }) => {
    const { productId } = params;


    const fetchObj = fetchFn(productId);

    // Prefetching logic for background synchronization
    await queryClient.prefetchQuery(fetchObj);

    return { productId }; // Returning only the ID for the component
};

export default loadProductDetails;
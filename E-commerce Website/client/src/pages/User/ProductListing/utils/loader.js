import {queryClient} from '../../../../main'; 
import fetchFn from './fetchFn';

const productListingLoader = async () => {
    
    await queryClient.prefetchQuery(fetchFn);
};
export default productListingLoader;
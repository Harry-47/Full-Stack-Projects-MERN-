import { useLoaderData } from 'react-router-dom';
import RenderDetails from './components/RenderDetails';
import SkeletonLoader from './components/SkeletonLoader';
import HandleStates from '../../../components/HandleStates';
import useFetchDetails from './hooks/useFetchDetails';

const ProductDetails = () => {

    const { productId: loaderId } = useLoaderData(); 

    //  1. useQuery for Product Details
    const { data: product, isLoading: isProductLoading, isError, status } = useFetchDetails(loaderId);
 
    // Skeleton Loader
    if (isProductLoading || !product) {
        <SkeletonLoader/>
    }

    if(isProductLoading || isError)
    {
        return <HandleStates
        isLoading={isProductLoading}
        isError={isError}
        status={status}
        />
    }
    return <RenderDetails product={product} />;
   
};

export default ProductDetails;
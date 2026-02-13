import fetchFn from '../utils/fetchFn';
import { useQuery } from '@tanstack/react-query';

const useFetchDetails = (productId) => {
    const fetchObj = fetchFn(productId);
    const {data, isLoading, isError, status} = useQuery(fetchObj);

    return {data, isLoading, isError, status};
}
export default useFetchDetails;
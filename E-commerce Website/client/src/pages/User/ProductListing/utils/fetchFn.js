import axiosApi from "../../../../utils/axiosInstance";

const fetchFn = {
    queryKey: ['products', 'listing'],
    queryFn: async () => {
        const { data } = await axiosApi.get('/users/products');
        return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
}

export default fetchFn
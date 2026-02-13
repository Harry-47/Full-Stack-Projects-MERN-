import axiosApi from "../../../../utils/axiosInstance";

const fetchFn = {
        queryKey: ['profile', 'orders'],
        queryFn: async () => {
            const { data } = await axiosApi.get(`/users/orders`);
            return data;
        }
    }
export default fetchFn;
import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../../../utils/axiosInstance";

const useFetchProducts = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["profile", "orders"],
    queryFn: async () => {
      try {
        const { data } = await axiosApi.get(`/users/orders`);
        // Check structures
        if (data.orders && Array.isArray(data.orders)) return data.orders;
        return Array.isArray(data) ? data : data.orders || [];
      } catch (err) {
        //If 404 (No orders found), return empty array immediately
        if (err.response && err.response.status === 404) {
          return [];
        }
        // Throw other errors (like 500 or Network Error) to be handled by isError
        throw err;
      }
    },
    staleTime: 0, //  Fetch the fresh orders dont show the old cached ones
    retry: false, //  Stop retrying on errors (makes response instant)
  });

  return { data, isLoading, isError, status}
};

export default useFetchProducts;

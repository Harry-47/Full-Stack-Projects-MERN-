import axiosApi from "../../../../utils/axiosInstance";
const fetchFn = (productId) => {
  return {
    queryKey: ["products", "detail", productId || loaderId],
    queryFn: async () => {
      const { data } = await axiosApi.get(
        `/users/products/${productId || loaderId}`,
      );
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 mins cache
  };
};

export default fetchFn;
import axiosApi from "../../../../utils/axiosInstance";

const decideURL = (request, params) => {
  const url = new URL(request.url);
  const { category } = params;
  const keyword = url.searchParams.get("keyword") || "";
  const page = url.searchParams.get("page") || 1;
  const brand = url.searchParams.get("brand") || "";
  const minPrice = url.searchParams.get("minPrice") || "";
  const maxPrice = url.searchParams.get("maxPrice") || "";
  const rating = url.searchParams.get("rating") || "";
  const discount = url.searchParams.get("discount") || "";

  const filters = {
    page,
    brand,
    minPrice,
    maxPrice,
    keyword,
    rating,
    discount,
  };
  const queryPath = new URLSearchParams(filters).toString();
  const apiUrl = category
    ? `/users/products/categories/${category}?${queryPath}`
    : `/users/products/search?${queryPath}`;

  return {
    fetchFn: {
      queryKey: ["products", "category", category, filters],
      queryFn: async () => {
        const { data } = await axiosApi.get(apiUrl);
        return data;
      },
      staleTime: 1000 * 60 * 60, // 1 hour
      retries: 1,
      gcTime: 1000 * 60 * 60, // 1 hour
    },

    filters,
    category
  };
};
export default decideURL;

export const fetchFn = (category, filters) => {

  return {
        // ⭐ Key must match the Loader exactly!
        queryKey: ['products', 'category', category, filters], 
        queryFn: async () => {
            const queryPath = new URLSearchParams(filters).toString();
            const apiUrl = category 
                ? `/user/products/categories/${category}?${queryPath}` 
                : `/user/products/search?${queryPath}`;
            const { data } = await axiosApi.get(apiUrl);
            return data;
        },
        staleTime: 1000 * 60 * 60,
        retries: 1

    }
}

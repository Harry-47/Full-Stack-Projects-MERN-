import { queryClient } from '../../../../main'; 
import { fetchAdminCategoryProducts } from "./fetchAdminCategoryProducts";

export const AdminproductListingCategoryLoader = async ({ request, params }) => {
    const url = new URL(request.url);
    const { category } = params;
    
    const filters = {
        page: url.searchParams.get("page") || 1,
        brand: url.searchParams.get("brand") || "",
        minPrice: url.searchParams.get("minPrice") || "",
        maxPrice: url.searchParams.get("maxPrice") || "",
        rating: url.searchParams.get("rating") || "",
        discount: url.searchParams.get("discount") || "",
        keyword: url.searchParams.get("keyword") || ""
    };

    try {
        await queryClient.prefetchQuery({
            queryKey: ['admin', 'products', 'category', category, filters],
            queryFn: () => fetchAdminCategoryProducts(category, filters),
        });
        return { filters };
    } catch (error) {
        throw new Response("Error loading admin category page", { status: 500 });
    }
};
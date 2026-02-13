import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { useAdminCategoryProducts } from "./hooks/useAdminCategory";
import RenderAdminCategory from "./components/RenderAdminCategory";
import HandleStates from "../../../components/HandleStates";

const AdminProductListingCategory = () => {
    const { filters } = useLoaderData();
    const { category } = useParams();
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // ⭐ Logic Hook se mangwa li
    const { data: productsData, isLoading, isError, status } = useAdminCategoryProducts(category, filters);

    if (isLoading || isError) {
        return <HandleStates isLoading={isLoading} isError={isError} status={status} />;
    }

    return (
        <RenderAdminCategory 
            productsData={productsData}
            category={category}
            isFilterOpen={isFilterSidebarOpen}
            onFilterOpen={() => setIsFilterSidebarOpen(true)}
            onCloseFilter={() => setIsFilterSidebarOpen(false)}
        />
    );
};

export default AdminProductListingCategory;
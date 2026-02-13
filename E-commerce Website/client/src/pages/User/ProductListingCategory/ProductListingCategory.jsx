import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {fetchFn} from "./utils/decideURL"
import HandleStates from "../../../components/HandleStates";
import RenderCategory from "./components/RenderCategory";


const ProductListingCategory = () => {
    const { filters, category} = useLoaderData();
    const fetchObj = fetchFn(category, filters);


const { data: productsData, isLoading, isError , status} = useQuery(fetchObj);

    return (
        <>
            {isLoading || isError ? (
                <HandleStates
                    isError={isError}
                    isLoading={isLoading}
                    status={status}
                />
            ) : (
                <RenderCategory
                    productsData={productsData}
                    category={category}
                />
            )}
        </>
    );
    
};

export default ProductListingCategory;
import { useAdminProducts } from "./hooks/useAdminProducts";
import RenderAdminListing from "./components/RenderAdminListing";
import LoadingSpinner from "../../../components/LoadingSpinner"; 
import HandleStates from "../../../components/HandleStates"; 

const AdminProductListing = () => {
    const { data, isLoading, isError, status } = useAdminProducts();

    if (isLoading) return <LoadingSpinner />;

    if (isError) {
        return <HandleStates isError={isError} status={status} />;
    }

    return <RenderAdminListing data={data || []} />;
};

export default AdminProductListing;
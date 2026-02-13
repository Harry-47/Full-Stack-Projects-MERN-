import { useParams } from "react-router-dom";
import { useAdminDetails } from "./hooks/useAdminDetails";
import RenderAdminDetails from "./components/RenderAdminDetail";
import LoadingSpinner from "../../../components/LoadingSpinner";
import HandleStates from "../../../components/HandleStates";

const AdminProductDetails = () => {
    const { id } = useParams();
    

    const { 
        formData, previewImage, handleChange, submitForm, 
        isLoading, isError, status, isSaving 
    } = useAdminDetails(id);

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <HandleStates isError={isError} status={status} />;

    return (
        <RenderAdminDetails 
            formData={formData}
            previewImage={previewImage}
            onChange={handleChange}
            onSubmit={submitForm}
            isSaving={isSaving}
        />
    );
};

export default AdminProductDetails;
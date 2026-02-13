import { useAddProduct } from "./hooks/useAddProduct";
import RenderAddProduct from "./components/RenderAddProduct";

const AddProduct = () => {
    const { 
        formData, previewImage, handleChange, handleSubmit, 
        uploadProgress, isProcessing, isPending 
    } = useAddProduct();

    return (
        <RenderAddProduct 
            formData={formData}
            previewImage={previewImage}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            uploadProgress={uploadProgress}
            isProcessing={isProcessing}
            isPending={isPending}
        />
    );
};

export default AddProduct;
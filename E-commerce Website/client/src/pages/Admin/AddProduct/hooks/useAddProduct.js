import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProductApi } from "../utils/useProductActions";
import { formatProductPayload } from "../utils/addProductHelpers";

export const useAddProduct = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Local State
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    
    const [formData, setFormData] = useState({
        image: null, title: "", description: "", price: "", brand: "",
        model: "", color: "", category: "", discount: "", rating: "", 
        onSale: false, stock: ""
    });

    // 2. Handlers
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === "file") {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setPreviewImage(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    // 3. Mutation
    const mutation = useMutation({
        mutationFn: async (payload) => {
            setUploadProgress(0);
            setIsProcessing(false);
            
            // API Call with Progress Callback
            return await createProductApi(payload, (percent) => {
                setUploadProgress(percent);
                if (percent === 100) setIsProcessing(true);
            });
        },
        onSuccess: () => {
            toast.success("Product Added Successfully! ✅");
            queryClient.invalidateQueries(['products']);
            navigate("/admin/dashboard/products");
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add product");
            setUploadProgress(0);
            setIsProcessing(false);
        }
    });

    // 4. Submit Wrapper
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = formatProductPayload(formData);
        mutation.mutate(payload);
    };

    return {
        formData,
        previewImage,
        handleChange,
        handleSubmit,
        uploadProgress,
        isProcessing,
        isPending: mutation.isPending
    };
};
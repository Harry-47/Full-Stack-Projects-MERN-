import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../../../utils/axiosInstance";
import { formatProductPayload } from "../utils/DetailHelpers";

export const useAdminDetails = (id) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 1. Local State for Form
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        image: null, title: "", description: "", price: "", brand: "",
        model: "", color: "", category: "", discount: "", rating: "", onSale: false,
    });

    // 2. Fetch Data
    const { data: product, isLoading, isError, status } = useQuery({
        queryKey: ['admin', 'product', id],
        queryFn: async () => {
            const { data } = await axiosApi.get(`/admin/products/edit/${id}`);
            return data;
        },
        staleTime: 1000 * 60 * 10,
    });

    // 3. Sync Data to State
    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "", description: product.description || "",
                price: product.price || "", brand: product.brand || "",
                model: product.model || "", color: product.color || "",
                category: product.category || "", discount: product.discount || "",
                rating: product.rating || "", onSale: product.onSale || false,
                image: null
            });
            setPreviewImage(product.image);
        }
    }, [product]);

    // 4. Update Mutation
    const mutation = useMutation({
        mutationFn: async (payload) => {
            const formattedData = formatProductPayload(payload);
            return await axiosApi.put(`/admin/products/edit/${id}`, formattedData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'products']);
            alert("✅ Product updated successfully!");
            navigate('/admin/dashboard/products');
        }
    });

    // 5. Handlers
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setPreviewImage(file ? URL.createObjectURL(file) : product?.image);
            setFormData(prev => ({ ...prev, [name]: file }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return {
        formData,
        previewImage,
        handleChange,
        submitForm,
        isLoading,
        isError,
        status,
        isSaving: mutation.isPending
    };
};
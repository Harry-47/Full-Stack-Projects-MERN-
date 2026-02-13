import { toast } from "react-toastify";
import axiosApi from "../../utils/axiosInstance";
import { addItemToCart } from "../../slices/cartSlice"; 

const handleAddToCart = async (product, quantity, dispatch) => {
    try {
        const res = await axiosApi.post(`/users/carts/new`, {
            productId: product._id,
            quantity: quantity
        });

        // ⭐ Check if response exists and is successful (200 or 201)
        if (res && (res.status === 200 || res.status === 201)) {
            
            // Dispatch Redux action immediately to update UI (Badge & Cart)
            dispatch(addItemToCart({
                productId: product, 
                quantity: quantity
            })); 

            toast.success(`Added ${quantity} x "${product.title}" to cart.`);
        }
    } catch (error) {
    console.error("Error adding to cart:", error);

    // If session expired and refresh failed (interceptor rejected)
    if (error.response?.status === 403 || error.response?.status === 401) {
         toast.error("Session expired. Please login again.");
         // Optional: Redirect manually if needed, though interceptor usually handles flow
         // window.location.href = '/auth/login'; 
    }
    else {
        toast.warn("Oops! Something strange happened");
    }
}
}

export default handleAddToCart;
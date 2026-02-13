import { toast } from "react-toastify";
import axiosApi from "../../../../utils/axiosInstance";
import { addItemToCart } from "../../../../slices/cartSlice"; 

const handleAddToCart = async (product, quantity, dispatch) => {
    try {
        // 1. Send request to Backend
        const res = await axiosApi.post('/users/carts/new', { 
            productId: product._id, 
            quantity 
        });

        // 2. If Backend says success, update Frontend (Redux) immediately
        if (res.status === 200 || res.status === 201) {
            dispatch(addItemToCart({
                productId: product, // Pass full product object
                quantity: quantity
            }));
            
            toast.success(`Added ${quantity} x "${product.title}" to cart.`);
            return res.data;
        }
    } catch (error) {
        console.error("Add to cart error:", error);
        
        if (error.response?.status === 401) {
            toast.error("Please login to add items to cart");
        } else {
            toast.error("Could not add item to cart.");
        }
        throw error;
    }
};

export default handleAddToCart;
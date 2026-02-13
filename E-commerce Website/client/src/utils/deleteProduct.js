import axiosApi from "../utils/axiosInstance";
import { toast } from "react-toastify";

/**
 * Sends a DELETE request to the server to remove a specific product.
 */
const deleteProduct = async (id) => {
  try {
    // Perform the deletion using the admin endpoint
    await axiosApi.delete(`/admin/products/delete/${id}`);
    
    // Manual reload is kept for immediate UI feedback, 
    // though invalidating queries via TanStack Query is the preferred modern approach.
    window.location.reload();
  } catch (err) {
    toast.error("Error deleting product:", err);
    // Extract error message from server response if available
    const message = err.response?.data?.message || "Failed to delete product";
    toast.error(`❌ ${message}`);
  }
};

export default deleteProduct;
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../../../../utils/axiosInstance';
import { updateItemQuantity, removeItemFromCart } from '../../../../slices/cartSlice';

const useCartActions = (cartItems) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Update Quantity Mutation
    const updateQtyMutation = useMutation({
        mutationFn: async ({ itemId, newQuantity }) => {
            return await axiosApi.post('/users/carts/update', { productId: itemId, quantity: newQuantity });
        },
        onSuccess: () => queryClient.invalidateQueries(['cart'])
    });

    // 2. Remove Item Mutation
    const removeItemMutation = useMutation({
        mutationFn: async (itemId) => {
            return await axiosApi.put(`/users/carts/remove/${itemId}`);
        },
        onSuccess: () => queryClient.invalidateQueries(['cart'])
    });

    // Handlers
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        // Optimistic Redux Update
        dispatch(updateItemQuantity({ id: itemId, quantity: newQuantity }));
        // Server Update
        updateQtyMutation.mutate({ itemId, newQuantity });
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromCart(itemId));
        removeItemMutation.mutate(itemId);
    };

    const handleCheckout = async () => {
        try {
            const cartItemsForCheckout = cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            }));
            
            await axiosApi.post('/users/carts/update', { cartItems: cartItemsForCheckout });
            navigate(`/user/checkout`);
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    return {
        handleQuantityChange,
        handleRemoveItem,
        handleCheckout,
        isUpdating: updateQtyMutation.isPending,
        isRemoving: removeItemMutation.isPending
    };
};

export default useCartActions;
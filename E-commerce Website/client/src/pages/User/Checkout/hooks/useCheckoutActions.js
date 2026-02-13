import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCart } from '../../../../slices/cartSlice';
import  placeOrder  from '../utils/placeOrder';
import { formatOrderPayload } from '../utils/formatOrder';

const useCheckoutActions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    return useMutation({
        // ⭐ Mutation ab raw data legi, khud format karegi, phir API call karegi
        mutationFn: ({ customerDetails, cartItems }) => {
            const payload = formatOrderPayload(customerDetails, cartItems);
            return placeOrder(payload);
        },
        
        onSuccess: () => {
            dispatch(clearCart());
            toast.success("Order Placed Successfully! ✅");
            navigate('/user/products');
        },
        
        onError: (error) => {
            const errorMessage = error.response?.data?.msg || 'Failed to place order.';
            toast.error(errorMessage);
        }
    });
};

export default useCheckoutActions;
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import axiosApi from '../../../../utils/axiosInstance';
import { setCart } from '../../../../slices/cartSlice';

const useCartQuery = () => {
    const dispatch = useDispatch();
    
    // Redux is the Source of Truth for UI
    const cartItems = useSelector((state) => state.cart.items);

    // Constants
    const shippingCost = 10;
    const taxRate = 0.08;

    // 1. Fetch & Sync Logic
    const { data: serverData, isLoading, isFetching } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const { data } = await axiosApi.get('/users/carts');
            return data;
        },
        staleTime: 0,
        refetchOnMount: true,
    });

    // ⭐ Sync Redux when Server Data arrives (Safer than doing it in queryFn)
    useEffect(() => {
        if (serverData && serverData.cartItems) {
            const totalQuantity = serverData.cartItems.reduce((acc, item) => acc + item.quantity, 0);
            dispatch(setCart({ items: serverData.cartItems, totalQuantity }));
        }
    }, [serverData, dispatch]);

    // 2. Calculation Logic
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.productId?.price || 0;
            return acc + (price * item.quantity);
        }, 0);
    }, [cartItems]);

    return {
        cartItems,
        subtotal,
        shippingCost,
        taxRate,
        isLoading: isLoading || isFetching,
        serverData // Needed for empty check
    };
};

export default useCartQuery;
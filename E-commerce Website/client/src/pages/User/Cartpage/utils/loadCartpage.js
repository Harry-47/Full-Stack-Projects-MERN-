import store from '../../../../store/store.js';
import { setCart } from '../../../../slices/cartSlice.js';
import axiosApi from '../../../../utils/axiosInstance';

const loadCartpage = async ({ queryClient }) => {

    let cartData;
    try {
        // 1. Prefetch data using the centralized axios instance for TanStack Query cache
        await queryClient.prefetchQuery({
            queryKey: ['cart'],
            queryFn: async () => {
                const { data } = await axiosApi.get('/users/carts');
                cartData = data
                return data;
            }
        });

        // 2. Initial Redux Synchronization to ensure UI items are ready immediately
        const totalQuantity = cartData.cartItems.reduce((acc, item) => acc + item.quantity, 0);
        
        // Dispatch to Redux Toolkit store
        store.dispatch(setCart({ items: data.cartItems, totalQuantity }));

        return data.cartItems;
    } catch (error) {
        console.error('Cart loader error:', error);
        // Reset cart in Redux if fetch fails to avoid stale data
        store.dispatch(setCart({ items: [], totalQuantity: 0 }));
        return [];
    }
};

export default loadCartpage;
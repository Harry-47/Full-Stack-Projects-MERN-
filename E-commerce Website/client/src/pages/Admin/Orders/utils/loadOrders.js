import axiosApi from '../../../../utils/axiosInstance';
import { queryClient } from '../../../../main'; 

export const loadOrders = async () => {
  try {
    await queryClient.prefetchQuery({
      queryKey: ['admin', 'orders'],
      queryFn: async () => {
        const { data } = await axiosApi.get('/admin/orders');
        return data;
      }
    });
    return null; 
  } catch (err) {
    console.error("Order loader error:", err);
    throw new Response("Error loading orders", { status: 500 });
  }
};

export default loadOrders;
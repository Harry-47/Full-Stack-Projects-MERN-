import axiosApi from './axiosInstance';

const deleteOrder = async (orderId) => {
  try {
    const { data } = await axiosApi.delete(`/admin/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

export default deleteOrder;
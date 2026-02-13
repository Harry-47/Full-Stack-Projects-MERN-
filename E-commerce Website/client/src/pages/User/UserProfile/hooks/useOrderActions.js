import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosApi from '../../../../utils/axiosInstance';
import addReview from '../utils/fetchReview'; // Ensure this path is correct relative to this file

const useOrderMutations = () => {
    const queryClient = useQueryClient();

    // 1. Cancel Order Mutation
    const cancelOrderMutation = useMutation({
        mutationFn: (orderId) => axiosApi.put(`/users/orders/cancel-order/${orderId}`),
        onSuccess: (data, orderId) => {
            // Optimistic Update
            queryClient.setQueryData(['profile', 'orders'], (oldOrders) => {
                const list = Array.isArray(oldOrders) ? oldOrders : (oldOrders?.orders || []);
                return list.map(order => 
                    order._id === orderId ? { ...order, status: 'Canceled' } : order
                );
            });
            queryClient.invalidateQueries(['profile', 'orders']);
            toast.success('Order canceled successfully! 👍');
        },
        onError: (err) => toast.warn(err.response?.data?.message || 'Failed to cancel order.'),
    retries: 2
    });

    // 2. Delete All Canceled Mutation
    const deleteAllMutation = useMutation({
        mutationFn: () => axiosApi.delete('/users/orders/delete-all'),
        onSuccess: () => {
            queryClient.setQueryData(['profile', 'orders'], (oldOrders) => {
                const list = Array.isArray(oldOrders) ? oldOrders : (oldOrders?.orders || []);
                return list.filter(order => order.status !== 'Canceled' && order.status !== 'Failed');
            });
            queryClient.invalidateQueries(['profile', 'orders']);
            toast.success('All canceled orders deleted successfully! ✅');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete orders.')
    });

    // 3. Review Mutation
    const reviewMutation = useMutation({
        mutationFn: ({ reviews, orderId }) => addReview({ reviews, orderId }),
        onSuccess: () => {
            queryClient.invalidateQueries(['profile', 'orders']);
            toast.success('Thanks for your review! 😊');
        },
        onError: () => toast.error('Failed to submit review. Please try again.')
    });

    return {
        handleCancelOrder: cancelOrderMutation.mutate,
        handleDeleteAll: deleteAllMutation.mutate,
        handleSubmitReview: reviewMutation.mutate,
        isCanceling: cancelOrderMutation.isPending,
        isDeleting: deleteAllMutation.isPending
    };
};

export default useOrderMutations;
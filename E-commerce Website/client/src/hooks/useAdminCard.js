import deleteOrder from '../utils/deleteOrder';
import { useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';

const useAdminCard = (orderId, initialStatus) => {
    const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'Pending');
    const { state } = useNavigation();

    const handleStatusChange = (e) => setSelectedStatus(e.target.value);

    const handleSaveStatus = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/update-status/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: selectedStatus }),
                credentials: 'include'
            });
            toast.success('Order status updated successfully!');
            window.location.reload(); 
        } catch (error) {
            toast.error('Failed to update order status.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                window.location.reload(); 
            } catch (error) {
                toast.error('Failed to delete order.');
            }
        }
    };

    const getStatusColor = (currentStatus) => {
        switch (currentStatus.toLowerCase()) {
            case 'shipped': return 'text-blue-500';
            case 'delivered': return 'text-green-500';
            case 'canceled': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return { 
        selectedStatus, 
        handleStatusChange, 
        handleSaveStatus, 
        handleDelete, 
        getStatusColor,
        isSaving: state === 'submitting'
    };
};

export default useAdminCard;
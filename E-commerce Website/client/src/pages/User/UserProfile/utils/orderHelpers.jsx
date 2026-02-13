import { FaTruck, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const getStatusIcon = (status, isVerified) => {
    if (isVerified) return <FaCheckCircle className="text-green-500" />;
    
    switch (status) {
        case 'Pending': return <FaClock className="text-yellow-500" />;
        case 'Shipped': return <FaTruck className="text-blue-500" />;
        case 'Delivered': return <FaCheckCircle className="text-green-500" />;
        case 'Canceled': return <FaTimesCircle className="text-red-500" />;
        default: return null;
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Canceled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
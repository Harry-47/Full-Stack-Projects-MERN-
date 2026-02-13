import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaTimesCircle } from 'react-icons/fa';
import OrderHistorySummary from '../../../../components/OrderHistorySummary';
import { getStatusIcon, getStatusColor } from '../utils/orderHelpers.jsx';

const orderItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const OrderItem = ({ 
    order, 
    isOpen, 
    onToggle, 
    onCancel, 
    onReview, 
    isCanceling, 
    highlightId 
}) => {
    return (
        <motion.div
            id={`order-${order._id}`}
            variants={orderItemVariants}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
            className={`bg-white p-6 rounded-4xl shadow-xl mb-8 flex flex-col gap-6 relative transition-transform hover:scale-[1.01] ${
                order._id === highlightId ? 'border-4 border-green-500' : ''
            }`}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => onToggle(order._id)}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getStatusColor(order.status).replace('bg-', 'bg-dark-').replace('text-', 'text-')}`}>
                        {getStatusIcon(order.status, order.isVerified)}
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-gray-800">Order ID: {order._id}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <p className="font-bold text-lg text-gray-900">{`$${(order.totalPrice || 0).toFixed(2)}`}</p>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${order.isVerified ? 'bg-green-300 text-black' : getStatusColor(order.status)}`}>
                            {order.isVerified ? (order.status === 'Delivered' ? 'Delivered' : 'Verified') : order.status}
                        </div>
                    </div>
                    <motion.button
                        initial={false}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <FaChevronDown size={20} />
                    </motion.button>
                </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Products List */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Products Ordered</h3>
                                {order.items.map(item => (
                                    <div key={item.productId?._id || Math.random()} className="flex items-center mb-4 p-2 bg-gray-50 rounded-lg">
                                        {item.productId && (
                                            <>
                                                <img src={item.productId.image} alt={item.productId.title} className="w-16 h-16 object-cover rounded-xl mr-4 border border-gray-200" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.productId.title}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Summary */}
                            <div className="w-full lg:w-1/3 flex flex-col justify-between p-4 bg-gray-50 rounded-3xl">
                                <OrderHistorySummary order={order} />
                            </div>
                        </div>

                        {/* Buttons (Review or Cancel) */}
                        <div className="flex justify-center mt-6">
                            {order.status === 'Delivered' && !order.hasReviewed && (
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); onReview(order); }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-120 py-3 rounded-full text-white font-bold shadow-md bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    Review Order
                                </motion.button>
                            )}

                            {!order.isVerified && order.status === 'Pending' && (
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); onCancel(order._id); }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={isCanceling}
                                    className="w-120 py-3 rounded-full text-white font-bold shadow-md bg-pink-700 hover:bg-pink-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <FaTimesCircle />
                                    <span>{isCanceling ? 'Canceling...' : 'Cancel Order'}</span>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrderItem;
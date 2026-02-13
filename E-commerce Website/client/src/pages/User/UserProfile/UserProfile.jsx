import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import useFetchOrders from "./hooks/useFetchOrders";
import useOrderMutations from './hooks/useOrderActions';
import useUserProfileUI from './hooks/useProfileUI';

// Components
import Navbar from '../../../components/SearchBar';
import Footer from '../../../components/Footer';
import WishlistSidebar from '../../../components/WishlistSidebar/WishlistSidebar';
import ReviewOrderModal from '../../../components/ReviewModal';
import WishlistHeartIcon from '../../../components/WishlistHeartIcon';
import EmptyState from './components/EmptyState';
import StatusMessage from './components/StatusMessage';
import OrderItem from './components/OrderItem';

// Actions
import { closeWishlist } from '../../../slices/uiSlice';

const UserProfile = () => {
    const { verificationResult } = useLoaderData();
    const dispatch = useDispatch();
    
    // 1. Data Fetching
    const { data: orders = [], isLoading, isError } = useFetchOrders();
    const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);

    // 2. Logic Hooks
    const { openOrderId, displayStatus, handleToggleDetails } = useUserProfileUI(verificationResult);
    const { handleCancelOrder, handleDeleteAll, handleSubmitReview, isCanceling, isDeleting } = useOrderMutations();

    // 3. Local State for Review Modal
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [orderToReview, setOrderToReview] = useState(null);

    const openReviewModal = (order) => {
        setOrderToReview(order);
        setIsReviewModalOpen(true);
    };

    const handleModalSubmit = (reviews) => {
        handleSubmitReview({ reviews, orderId: orderToReview._id });
        setIsReviewModalOpen(false);
    };

    // 4. Derived State
    const safeOrders = Array.isArray(orders) ? orders : [];
    const hasCanceledOrders = safeOrders.some(o => o.status === 'Canceled' || o.status === 'Failed');

    // 5. Render Loading / Empty
    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading your history...</div>;
    if (isError || safeOrders.length === 0) {
        return <EmptyState message={isError ? "Error fetching orders 🙁" : "No orders yet 🙁"} subMessage="Ready to shop?" />;
    }

    // 6. Main Render
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="min-h-screen flex flex-col bg-gray-50 poppins-regular relative"
        >
            <Navbar />
            
            <div className="flex-1 p-6 md:p-12 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">Your Order History</h1>
                
                <StatusMessage status={displayStatus.status} message={displayStatus.message} />

                {/* Orders List */}
                <motion.div 
                    className="w-full max-w-6xl"
                    initial="hidden" animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                >
                    <AnimatePresence>
                        {safeOrders.map(order => (
                            <OrderItem 
                                key={order._id}
                                order={order}
                                isOpen={openOrderId === order._id}
                                onToggle={handleToggleDetails}
                                onCancel={handleCancelOrder}
                                onReview={openReviewModal}
                                isCanceling={isCanceling}
                                highlightId={verificationResult?.verifiedid}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Delete All Button */}
                {hasCanceledOrders && (
                    <motion.button
                        onClick={() => { if(window.confirm("Sure?")) handleDeleteAll(); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting}
                        className="mt-12 px-8 py-3 bg-red-600 text-white font-semibold rounded-4xl shadow-md flex items-center gap-2"
                    >
                        <FaTrashAlt />
                        {isDeleting ? 'Deleting...' : 'Delete All Canceled Orders'}
                    </motion.button>
                )}
            </div>

            <WishlistHeartIcon />
            <WishlistSidebar isOpen={isWishlistOpen} onClose={() => dispatch(closeWishlist())} />
            <Footer />
            
            <ReviewOrderModal 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
                order={orderToReview} 
                onSubmit={handleModalSubmit} 
            />
        </motion.div>
    );
};

export default UserProfile;
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../../../components/SearchBar';
import Footer from '../../../../components/Footer';
import CartSummary from '../../../../components/CartSummary';
import WishlistSidebar from '../../../../components/WishlistSidebar/WishlistSidebar';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import WishlistHeartIcon from '../../../../components/WishlistHeartIcon';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';

const RenderCart = (props) => {
    const { 
        cartItems, isLoading, serverData, subtotal, shippingCost, taxRate, 
        actions, isWishlistOpen, onCloseWishlist 
    } = props;

    // 1. Loading State
    if (!serverData || isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex justify-center items-center bg-white">
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    // 2. Empty State
    if (cartItems.length === 0) {
        return <EmptyCart isWishlistOpen={isWishlistOpen} onCloseWishlist={onCloseWishlist} />;
    }

    // 3. Main Cart Content
    return (
        <>
            <Navbar />
            <div className="min-h-screen p-6 md:p-12 bg-white poppins-regular">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-10 text-center text-gray-800 flex items-center justify-center gap-4"
                >
                    <FaShoppingCart className="text-4xl text-black" />
                    Your Shopping Cart
                </motion.h1>

                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Items List */}
                    <div className="flex-1">
                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <CartItem 
                                    key={item.productId._id} 
                                    item={item}
                                    onUpdateQty={actions.handleQuantityChange}
                                    onRemove={actions.handleRemoveItem}
                                    disabled={actions.isUpdating || actions.isRemoving}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:w-1/3"
                    >
                        <CartSummary
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            taxRate={taxRate}
                            onCheckout={actions.handleCheckout}
                        />
                    </motion.div>
                </div>
            </div>

            <WishlistHeartIcon />
            <WishlistSidebar isOpen={isWishlistOpen} onClose={onCloseWishlist} />
            <Footer />
        </>
    );
};

export default RenderCart;
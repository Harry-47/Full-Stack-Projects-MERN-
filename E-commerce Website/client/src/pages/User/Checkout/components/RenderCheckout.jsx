import { motion } from 'framer-motion';
import Navbar from '../../../../components/SearchBar';
import Footer from '../../../../components/Footer';
import CheckoutCarousel from '../../../../components/CheckoutCarousel';
import ShippingForm from './ShippingForm';
import EmptyCartState from './EmptyCartState';

const RenderCheckout = ({ onSubmit, isSubmitting, isEmpty }) => {
    
    if (isEmpty) {
        return <EmptyCartState />;
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-50 poppins-regular">
            <Navbar />
            <main className="flex-1 p-6 md:p-12">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-4xl font-bold mb-10 text-center text-gray-800"
                >
                    Checkout
                </motion.h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Form Component  */}
                    <ShippingForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
                    
                    {/* Carousel Component */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.5 }} 
                        className="hidden lg:block h-96"
                    >
                        <CheckoutCarousel />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div> 
    );
};

export default RenderCheckout;
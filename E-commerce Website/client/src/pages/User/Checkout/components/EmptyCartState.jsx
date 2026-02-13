import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyCartState = () => (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 poppins-regular">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-black">Your cart is empty 🙁</h1>
            <p className="text-lg text-gray-700 mb-8">Add some amazing products to get started!</p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full max-w-xs">
                <Link to="/user/products" className="w-full py-4 rounded-4xl text-white font-bold shadow-lg bg-black hover:bg-gray-800 flex items-center justify-center">
                    Go to Homepage
                </Link>
            </motion.div>
        </motion.div>
    </div>
);

export default EmptyCartState;
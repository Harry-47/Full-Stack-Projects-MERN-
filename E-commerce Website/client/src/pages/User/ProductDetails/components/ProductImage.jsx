import { motion } from "framer-motion";

const ProductImage = ({ image, title }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 flex-shrink-0 relative overflow-hidden rounded-4xl"
        >
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-4xl shadow-lg transform transition-all duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent"></div>
        </motion.div>
    );
};

export default ProductImage;
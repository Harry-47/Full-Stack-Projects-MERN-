import { motion } from "framer-motion";

const ProductInfo = ({ product }) => {
    return (
        <div>
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl font-bold text-gray-800 mb-4"
            >
                {product.title}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600 text-lg mb-6"
            >
                {product.description}
            </motion.p>
            <div className="grid grid-cols-2 gap-y-4 text-gray-700 mb-8">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Model:</strong> {product.model}</p>
                <p><strong>Color:</strong> {product.color}</p>
                <p><strong>Category:</strong> {product.category}</p>
            </div>
        </div>
    );
};

export default ProductInfo;
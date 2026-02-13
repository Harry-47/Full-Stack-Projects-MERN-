import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCartMutation } from "../hooks/useDetailsActions"; // Import Fixed Hook

const ProductActions = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    
    // ⭐ Hook Call (Top Level - Correct Way)
    const { mutate, isPending } = useCartMutation();

    const handleQuantityChange = (action) => {
        if (action === "increment") setQuantity(prev => prev + 1);
        else if (action === "decrement" && quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = () => {
        // ⭐ Trigger mutation logic
        mutate({ product, quantity });
    };

    return (
        <div className="mt-auto">
            {/* Price & Rating Section */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                    <span className="text-sm font-semibold text-gray-800 ml-1">
                        {product.rating ? product.rating.toFixed(1) : "N/A"}
                    </span>
                </div>
                <p className="text-3xl font-bold text-gray-800 mr-12">
                    {product.price} $
                    {product.discount > 0 && <span className="ml-4 text-green-600 text-lg font-semibold">{product.discount}% OFF</span>}
                </p>
            </div>

            {/* Quantity & Button Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 border border-gray-300 rounded-full px-4 py-2">
                    <button className="text-gray-600 hover:text-gray-900 cursor-pointer disabled:opacity-50" onClick={() => handleQuantityChange("decrement")} disabled={quantity <= 1}>
                        <FaMinus />
                    </button>
                    <span className="text-xl font-medium">{quantity}</span>
                    <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => handleQuantityChange("increment")}>
                        <FaPlus />
                    </button>
                </div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative overflow-hidden rounded-4xl sm:w-auto flex-1 transition-all duration-300">
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="w-full py-4 px-8 text-white font-bold shadow-lg relative bg-black rounded-4xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <FaShoppingCart />
                            {isPending ? "Adding..." : "Add to Cart"}
                        </span>
                        {/* Hover Effects */}
                        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductActions;
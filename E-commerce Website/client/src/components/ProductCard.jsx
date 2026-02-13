import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProductCard = ({ product, linkTo, topRightAction, bottomRightAction }) => {
    const discountedPrice = (product.price - (product.price * (product.discount / 100))).toFixed(2);

    return (
        <Link
            to={linkTo} 
            className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative group overflow-hidden flex flex-col w-[300px] min-h-[400px] bg-white border border-gray-200 hover:border-black"
        >
            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col flex-1">
                
                {/* Product Image */}
                <div className="relative overflow-hidden h-52 bg-gray-100 p-4">
                    <motion.img
                        src={product.image} alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-118"
                    />
                    {product.discount > 0 && (
                        <span className="absolute top-2 left-2 text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-full">Sale!</span>
                    )}
                </div>

                {/* ⭐ SLOT 1: Top Right Action (Wishlist OR Delete) */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {topRightAction}
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-1 p-6 relative z-10">
                    <h3 className="text-lg font-bold line-clamp-1 text-gray-900 group-hover:text-black transition-colors duration-300">{product.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.brand}</p>

                    <div className="flex flex-col gap-2 mt-auto pt-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <FaStar /> <span className="text-sm font-semibold text-gray-800">{product.rating || "4.5"}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            {product.discount > 0 ? (
                                <>
                                    <p className="text-xl font-bold text-green-600">{discountedPrice} $</p>
                                    <p className="text-sm text-gray-500 line-through">{product.price} $</p>
                                </>
                            ) : (
                                <p className="text-xl font-bold text-green-600">{product.price} $</p>
                            )}
                            {product.discount > 0 && <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">{product.discount}% OFF!</span>}
                        </div>

                        <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-1"><span className="text-gray-500">Sales:</span> <span>{product.sales}</span></div>
                            <div className="flex items-center gap-1"><span className="text-gray-500">Stock:</span> <span>{product.stock}</span></div>
                        </div>
                    </div>
                </div>

                {/* ⭐ SLOT 2: Bottom Right Action (Cart OR Null) */}
                {bottomRightAction && (
                    <div className="z-30">
                        {bottomRightAction}
                    </div>
                )}

            </motion.div>
        </Link>
    );
};

export default ProductCard;
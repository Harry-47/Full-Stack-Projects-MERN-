import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ProductReviews = ({ reviews }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full"
        >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Reviews</h2>
            {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((rev, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center mb-2">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm font-semibold text-gray-600">{rev.rating.toFixed(1)}/5</span>
                            </div>
                            <p className="text-gray-700 italic mb-2">"{rev.review}"</p>
                            <p className="text-sm text-gray-500">
                                Reviewed by {rev.userId ? rev.userId.name : "Anonymous"} on {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No Reviews yet. Be the first to Review this product!</p>
            )}
        </motion.div>
    );
};

export default ProductReviews;
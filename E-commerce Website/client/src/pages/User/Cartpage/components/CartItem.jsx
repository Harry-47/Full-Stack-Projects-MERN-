import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQty, onRemove, disabled }) => {
    if (!item.productId) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-4xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center mb-6 relative overflow-hidden transition-transform hover:scale-[1.01]"
        >
            <Link to={`/user/products/${item.productId._id}`}>
                <img
                    src={item.productId.image}
                    alt={item.productId.title}
                    className="w-24 h-24 object-cover rounded-2xl mr-6 mb-4 sm:mb-0"
                />
            </Link>
            <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                <div className="flex-1 mb-4 sm:mb-0">
                    <h2 className="text-xl font-semibold">{item.productId.title}</h2>
                    <p className="text-gray-600">${item.productId.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={() => onUpdateQty(item.productId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || disabled}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            <FaMinus className="text-xs text-gray-600" />
                        </motion.button>
                        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                        <motion.button
                            onClick={() => onUpdateQty(item.productId._id, item.quantity + 1)}
                            disabled={disabled}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            <FaPlus className="text-xs text-gray-600" />
                        </motion.button>
                    </div>
                    <motion.button
                        onClick={() => onRemove(item.productId._id)}
                        disabled={disabled}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-4 text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </motion.button>
                    <div className="text-xl font-bold text-right min-w-[70px]">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;
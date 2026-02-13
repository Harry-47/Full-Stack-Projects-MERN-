import { MdDelete } from "react-icons/md";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

const RoundBtn = ({ onClick, children, className }) => (
    <motion.button
        className={`p-3 bg-white rounded-full shadow-md transition-colors duration-300 cursor-pointer ${className}`}
        whileHover={{ scale: 1.1, rotate: 360, backgroundColor: 'white' }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(e); }}
    >
        {children}
    </motion.button>
);

// --- 1. Delete Button (For Admin) ---
export const DeleteAction = ({ onDelete }) => (
    <RoundBtn onClick={onDelete} className="text-red-500">
        <MdDelete />
    </RoundBtn>
);

// --- 2. Wishlist Button (For User) ---
export const WishlistAction = ({ isWishlisted, onToggle }) => (
    <RoundBtn onClick={onToggle} className={isWishlisted ? 'text-red-500' : 'text-gray-500'}>
        <FaHeart />
    </RoundBtn>
);

// --- 3. Cart Button (For User - Bottom Right) ---
export const CartAction = ({ onAdd }) => (
    <motion.button
        className="absolute bottom-26 right-6 z-30 p-4 bg-black text-white rounded-full shadow-lg"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(e); }}
        whileHover={{ scale: 1.1, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.9 }}
    >
        <FaShoppingCart className="text-lg" />
    </motion.button>
);
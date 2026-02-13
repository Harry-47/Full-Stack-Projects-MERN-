import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toggleWishlist } from "../slices/uiSlice";

const WishlistHeartIcon = () => {
  const dispatch = useDispatch();

  const shineVariant = {
    animate: {
      backgroundPosition: ['-100% 50%', '100% 50%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  return (
    <motion.div
      onClick={() => dispatch(toggleWishlist())}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-lg cursor-pointer overflow-hidden"
    >
      <motion.div
        variants={shineVariant}
        animate="animate"
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
      <FaHeart size={24} className="relative z-10" />
    </motion.div>
  );
};

export default WishlistHeartIcon;


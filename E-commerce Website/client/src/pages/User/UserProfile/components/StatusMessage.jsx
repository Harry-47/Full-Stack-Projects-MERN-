import { motion } from 'framer-motion';

const StatusMessage = ({ status, message }) => {
    if (!status) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`w-full max-w-6xl p-4 rounded-xl mb-6 text-center font-bold ${
                status === 'success' 
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                : 'bg-red-100 text-red-800 border-2 border-red-500'
            }`}
        >
            {message}
        </motion.div>
    );
};

export default StatusMessage;
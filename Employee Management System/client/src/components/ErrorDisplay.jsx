import { motion } from 'framer-motion';

const ErrorDisplay = ({ message = "Oops!, something went wrong , try again", onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl shadow-sm"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
        className="text-5xl mb-4"
      >
        ⚠️
      </motion.div>

      <h2 className="text-xl font-bold text-red-700 mb-2 italic">
        "Error!"
      </h2>
      
      <p className="text-red-600 text-center mb-6 font-medium">
        {message}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry? onRetry :  ()=> window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-md"
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorDisplay;
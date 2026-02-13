import { motion } from 'framer-motion';
const SkeletonLoader = () => {
  return (
            <div className="min-h-screen flex justify-center items-center p-8 bg-gray-100">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-4xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row gap-8"
                >
                    <motion.div
                        className="w-full h-96 md:w-1/2 bg-gray-200 rounded-4xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                    />
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
                        <div className="h-6 bg-gray-200 rounded-lg w-full" />
                        <div className="h-6 bg-gray-200 rounded-lg w-full" />
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                        <div className="h-12 bg-gray-200 rounded-4xl" />
                        <div className="h-12 bg-gray-200 rounded-4xl" />
                    </div>
                </motion.div>
            </div>
        );
}

export default SkeletonLoader
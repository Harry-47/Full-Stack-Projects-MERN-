import {motion} from "framer-motion"
const EmptyState = () => {
  return (
    <motion.div
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="text-center text-gray-500 mt-20 p-8 "
     >
         <p className="text-lg font-semibold">
             We couldn't find any products in this category.
         </p>
         <p className="mt-2 text-xl">
             Try adjusting your filters or checking out another category.
         </p>
 </motion.div>
  )
}

export default EmptyState;
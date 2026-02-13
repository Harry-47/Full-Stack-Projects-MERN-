import {motion} from "framer-motion";
import ProductCard from "../../../../components/ProductCard";
import Pagination from "../../../../components/Pagination";

// Variants for staggered entry animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};
const ProductsGrid = ({products, currentPage, totalPages}) => {
  return (
    <>
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
  >
      {products.map((product) => (
          <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} page={'user'} />
          </motion.div>
      ))}
  </motion.div>
  <Pagination currentPage={currentPage} totalPages={totalPages} ></Pagination>


    </>
  )
}

export default ProductsGrid
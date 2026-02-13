import FilterSidebar from "../../../../components/FilterSidebar"
import ProductsGrid from "./ProductsGrid"
import EmptyState from "./EmptyState"
import { FaFilter } from 'react-icons/fa';
import { toggleFilterSidebar } from "../../../../slices/uiSlice"
import { motion } from "framer-motion"

const MainContentArea = ({productsData, category}) => {

      const { products = [], totalPages = 1, currentPage = 1 } = productsData || {};

  return (
    <>
    <div className="hidden md:block">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <FilterSidebar isOpen={true} onClose={() => {}} />
                        </motion.div>
                    </div>

                    {/* Product Display Area */}
                    <div className="w-full">
                        {/* Header for Product List */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold capitalize text-gray-900">
                                    {category || 'Search Results'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Find your perfect style from our exclusive collection.
                                </p>
                            </div>

                            {/* Mobile Filter Button */}
                            <motion.button
                                onClick={() => dispatch(toggleFilterSidebar())}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="md:hidden p-3 text-white bg-black rounded-full shadow-lg flex items-center gap-2"
                            >
                                <FaFilter />
                            </motion.button>
                        </div>

                        {/* Product Grid */}
                        {products && products.length > 0 ? (
                            <>
                                <ProductsGrid
                                  products={products}
                                  totalPages={totalPages}
                                  currentPage={currentPage}
                                  ></ProductsGrid>
                            </>
                        ) : (
                            <EmptyState/>
                        )}
                    </div>
    </>
  )
}

export default MainContentArea
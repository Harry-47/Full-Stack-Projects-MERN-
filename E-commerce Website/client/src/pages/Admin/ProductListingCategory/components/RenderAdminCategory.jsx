import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import ProductCard from "../../../../components/ProductCard";
import Navbar from "../../../../components/SearchBar";
import CategoryIcons from "../../../../components/CategoryIcons";
import FilterSidebar from "../../../../components/FilterSidebar";
import Pagination from "../../../../components/Pagination";
import Footer from "../../../../components/Footer";

const RenderAdminCategory = ({ productsData, category, onFilterOpen, isFilterOpen, onCloseFilter }) => {
    const { products = [], totalPages = 1, currentPage = 1 } = productsData || {};

    const DeleteIcon = (
        <MdDelete className="text-red-500 cursor-pointer hover:text-red-700 text-2xl" />
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col justify-between poppins-regular"
        >
            <Navbar page={"admin"} />
            <CategoryIcons page={"admin"} />
            
            <div className="flex flex-grow relative">
                {/* Sidebar logic */}
                <div className="md:w-1/4 lg:w-1/5">
                    <div className="hidden md:block">
                        <FilterSidebar isOpen={true} onClose={() => {}} />
                    </div>
                    <div className="md:hidden">
                        <FilterSidebar isOpen={isFilterOpen} onClose={onCloseFilter} />
                    </div>
                </div>
                
                <div className="flex-grow p-4 md:w-3/4 lg:w-4/5">
                    <div className="flex justify-between items-center mb-4 md:hidden">
                        <h2 className="text-2xl font-bold capitalize text-gray-800">
                            Showing: {category || "Search Results"}
                        </h2>
                        <button onClick={onFilterOpen} className="p-2 text-white bg-blue-600 rounded-full shadow-lg flex items-center gap-2">
                            <FaFilter />
                        </button>
                    </div>

                    {products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} DeleteIcon={DeleteIcon} page={"admin"} />
                                ))}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                        </>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No products found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </motion.div>
    );
};

export default RenderAdminCategory;
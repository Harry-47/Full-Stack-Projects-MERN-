import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import ProductSlider from '../../../../components/ProductSlider';
import Navbar from '../../../../components/SearchBar';
import CategoryIcons from '../../../../components/CategoryIcons';
import Footer from '../../../../components/Footer';
import { AdminProductCard } from "../../../../components/ProductCardUtils/Wrappers";

const RenderAdminListing = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="min-h-screen flex flex-col justify-between poppins-regular"
        >
            <div>
                <Navbar page={"admin"} />
                <CategoryIcons page={"admin"} />

                <div className="space-y-10 px-4 mt-6 overflow-auto">
                    {data.map(({ category, products }, index) => (
                        <ProductSlider
                            icon={<MdDelete />}
                            key={index}
                            category={category}
                            products={products}
                            page={"admin"}
                            renderItem={(product) => <AdminProductCard product={product} />}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </motion.div>
    );
};

export default RenderAdminListing;
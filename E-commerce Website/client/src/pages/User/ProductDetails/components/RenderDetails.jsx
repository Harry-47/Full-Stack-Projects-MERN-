import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../../../components/SearchBar";
import Footer from "../../../../components/Footer";
import WishlistSidebar from "../../../../components/WishlistSidebar/WishlistSidebar";
import WishlistHeartIcon from "../../../../components/WishlistHeartIcon";
import { closeWishlist } from "../../../../slices/uiSlice";

import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductReviews from "./ProductReviews";

const RenderDetails = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 poppins-regular p-8 relative">
        
        {/* Main Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-4xl shadow-xl max-w-5xl w-full flex flex-col lg:flex-row gap-12 mb-[10%]"
        >
          {/* Left Side: Image */}
          <ProductImage image={product.image} title={product.title} />

          {/* Right Side: Info & Actions */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <ProductInfo product={product} />
            {/* Logic for Add to Cart is handled inside Actions */}
            <ProductActions product={product} />
          </div>
        </motion.div>

        {/* Reviews Section */}
        <ProductReviews reviews={product.reviews} />
      </div>

      <WishlistHeartIcon />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => dispatch(closeWishlist())}
      />
      <Footer />
    </>
  );
};

export default RenderDetails;
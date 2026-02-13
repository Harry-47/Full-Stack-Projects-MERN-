import SearchBar from "../../../../components/SearchBar";
import CategoryIcons from "../../../../components/CategoryIcons";
import ProductSlider from "../../../../components/ProductSlider";
import Footer from "../../../../components/Footer";
import WishlistSidebar from "../../../../components/WishlistSidebar/WishlistSidebar";
import HeroBanner from "../components/HeroBanner";
import FeaturedSection from "../components//FeaturedSection";

import { useSelector, useDispatch } from "react-redux";
import { closeWishlist } from "../../../../slices/uiSlice";
import WishlistHeartIcon from "../../../..//components/WishlistHeartIcon";
import {UserProductCard} from "../../../../components/ProductCardUtils/Wrappers";

const RenderProducts = ({ data }) => {
  const dispatch = useDispatch();
  const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);

  return (
    
    <div className="min-h-screen flex flex-col justify-between poppins-regular w-full max-w-[100vw] overflow-x-hidden relative">
  
      <div>
                <SearchBar />
                <HeroBanner />
                <CategoryIcons page={"user"} />
        <div className="space-y-10 mt-6 px-4">
            
          <FeaturedSection
            products={
              data.length > 0
                ? data[Math.floor(Math.random() * data.length)].products.slice(
                    0,
                    4,
                  )
                : []
            }
          />
            
          {data.map(({ category, products }, index) => (
            <ProductSlider
              key={index}
              category={category}
              products={products}
              page={"user"}
              renderItem={(product) => <UserProductCard product={product} />}           
             />
          ))}
          
        </div>
    
      </div>
                  <WishlistHeartIcon></WishlistHeartIcon>
           
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => dispatch(closeWishlist())}
      />
            <Footer />   
    </div>
  );
};

export default RenderProducts;

import SearchBar from "../../../../components/SearchBar";
import CategoryIcons from "../../../../components/CategoryIcons";
import Footer from "../../../../components/Footer";
import FilterSidebar from "../../../../components/FilterSidebar";
import { motion } from "framer-motion";
import WishlistSidebar from "../../../../components/WishlistSidebar/WishlistSidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  closeWishlist,
  setFilterSidebarOpen,
} from "../../../../slices/uiSlice";
import WishlistHeartIcon from "../../../../components/WishlistHeartIcon";
import MainContentArea from "./MainContentArea";

const RenderCategory = ({ productsData, category }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isFilterSidebarOpen);
  const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);

  return (
    <motion.div className="min-h-screen flex flex-col poppins-regular relative">
         
      <div className="flex-1">
          <SearchBar />
          <CategoryIcons page={"user"} />       {/* Main Content Area */}       
        <div className="p-2 sm:p-3 lg:p-5 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-3">
                             
          <MainContentArea
            productsData={productsData}
            category={category}
          ></MainContentArea>
                 
        </div>
           
      </div>
                              {/* Mobile Filter Sidebar */}   
      <div className="md:hidden">
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => dispatch(setFilterSidebarOpen(false))}
        />
      </div>
       <WishlistHeartIcon />
                     
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => dispatch(closeWishlist())}
      />
       <Footer />
    </motion.div>
  );
};

export default RenderCategory;

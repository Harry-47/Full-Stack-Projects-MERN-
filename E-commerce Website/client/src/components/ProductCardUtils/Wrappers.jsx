import ProductCard from "../ProductCard";
import useProductCard from "../../hooks/useProductCard"; 
import { WishlistAction, CartAction, DeleteAction } from "./Buttons"; 

// --- 1. User Card Wrapper ---
export const UserProductCard = ({ product }) => {
    const { isWishlisted, toggleWishlist, addToCart } = useProductCard(product, "user");

    return (
        <ProductCard
            product={product}
            linkTo={`/user/products/${product._id}`}
            topRightAction={<WishlistAction isWishlisted={isWishlisted} onToggle={toggleWishlist} />}
            bottomRightAction={<CartAction onAdd={addToCart} />}
        />
    );
};

// --- 2. Admin Card Wrapper ---
export const AdminProductCard = ({ product }) => {
    const { deleteItem } = useProductCard(product, "admin");

    return (
        <ProductCard
            product={product}
            linkTo={`/admin/dashboard/edit/${product._id}`}
            topRightAction={<DeleteAction onDelete={deleteItem} />}
            bottomRightAction={null}
        />
    );
};
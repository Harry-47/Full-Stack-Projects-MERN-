import deleteProduct from "../utils/deleteProduct";
import { useState, useEffect } from "react";
import handleAddToCart from "../components/WishlistSidebar/handleAddToCart";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux'

const useProductCard = (product, page) => {
    const dispatch = useDispatch();
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Initial Wishlist Check
    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setIsWishlisted(wishlist.some(item => item._id === product._id));
    }, [product._id]);

    // Helper: Discount Logic
    const getDiscountedPrice = () => {
        const discountedAmount = product.price * (product.discount / 100);
        return (product.price - discountedAmount).toFixed(2);
    };

    // Handler: Wishlist
    const toggleWishlist = (e) => {
        e.preventDefault(); e.stopPropagation();
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (isWishlisted) {
            wishlist = wishlist.filter(item => item._id !== product._id);
        } else {
            const productToAdd = { ...product, discountedPrice: getDiscountedPrice() };
            wishlist.push(productToAdd);
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? "Removed from wishlist!" : "Added to wishlist!");
    };

    // Handler: Delete (Admin)
    const deleteItem = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(product._id);
        }
    };

    // Handler: Cart
    const addToCart = (e) => {
        e.preventDefault(); e.stopPropagation();
        handleAddToCart(product, 1, dispatch);
    };

    return { 
        isWishlisted, 
        toggleWishlist, 
        deleteItem, 
        addToCart, 
        discountedPrice: getDiscountedPrice(),
        isAdmin: page === "admin"
    };
};

export default useProductCard;
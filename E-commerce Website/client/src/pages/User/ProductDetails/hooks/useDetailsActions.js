import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import handleAddToCart from "../utils/handleAddToCart"; 

export const useCartMutation = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({ product, quantity }) => handleAddToCart(product, quantity, dispatch),
    });
};
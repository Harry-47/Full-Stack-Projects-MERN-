export const formatOrderPayload = (customerDetails, cartItems) => {
    // Backend specific formatting yahan hogi
    const itemsWithPrice = cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        name: item.productId.title
    }));

    return {
        ...customerDetails,
        cartItems: itemsWithPrice
    };
};
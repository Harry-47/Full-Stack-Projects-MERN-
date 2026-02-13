
const { Cart } = require('../../models/cartSchema'); 
const  Product  = require('../../models/productSchema')

const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from the authenticated JWT
        
        // Find the user's cart and populate the products array with product details
        const cart = await Cart.findOne({ userId }).populate('products.productId', 'title price image');

        if (!cart) {
            return res.status(200).json({ cartItems: [] });
        }

        res.status(200).json({ cartItems: cart.products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; 

        const { productId, quantity } = req.body;

        console.log("Adding to cart:", { userId, productId, quantity });

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Cart exists, check if the product is already in the cart
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                // Product exists, update the quantity
                cart.products[itemIndex].quantity += quantity;
            } else {
                // Product does not exist, add it to the cart
                cart.products.push({ productId, quantity });
            }
            await cart.save();
        } else {
            // No cart exists for the user, create a new one
            cart = await Cart.create({
                userId,
                products: [{ productId, quantity }]
            });
        }

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // Get productId from URL parameters

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to be removed
    cart.products = cart.products.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, cartItems } = req.body; 

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Case 1 (Checkout Logic)
    if (cartItems && Array.isArray(cartItems)) {
      cart.products = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      await cart.save();
      return res.status(200).json({ success: true, message: 'Cart synced for checkout', cart });
    }

    // Case 2 (Update Logic)
    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json({ success: true, message: 'Quantity updated', cart });
    } else {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
};

module.exports = { getCartItems, addToCart, removeFromCart, updateCartQuantity };
const  Order   = require('../../models/orderSchema');
const { Cart } = require('../../models/cartSchema');
const { User } = require("../../models/userSchema")
const { sendEmail } = require('../../configs/nodemailerConfig');
const Product  = require('../../models/productSchema');
const fs = require("fs")
const path = require("path")


exports.placeOrder = async (req, res) => {
    try {
        // Change 'items' to 'cartItems' to match the front-end submission
        const { name, address, phone, cartItems, } = req.body;

        // User ID from authenticated token
        const userId = req.user.id

        // Calculate subtotal from the cart items
        // This is a crucial step to prevent trusting the client-side subtotal
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Define shipping and tax for server-side validation
        const shippingCost = 10;
        const taxRate = 0.08;
        const serverCalculatedTotal = subtotal + shippingCost + (subtotal * taxRate);


        //Update the product stock based on the ordered quantities
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for product: ${product.title}` });
                }
                product.stock -= item.quantity;
                product.sales += item.quantity; // Update sales count
                await product.save();
            }
        }

        // Create a new order document
        const newOrder = new Order({
            userId,
            items: cartItems, 
            totalPrice: serverCalculatedTotal,
            subtotal, 
            shippingCost,
            name,
            address,
            phone
        });

        await newOrder.save();

       const userDoc = await User.findOne({ "_id": userId }).select('email name displayName');

        // ✅ generate QR code URL
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${"http://localhost:5173/user/profile/"+newOrder._id}?verification=true`;

        // ✅ import email template
        const templatePath = path.join(__dirname, '../', '../', 'Utils', 'Emails', 'placeOrder.html');

        // ✅ read the template file
        let emailHtml = fs.readFileSync(templatePath, 'utf-8');

        // ✅ replace placeholders with actual values
        emailHtml = emailHtml.replace('{{userName}}', userDoc.name || userDoc.displayName || 'Dear Customer'); 
        emailHtml = emailHtml.replace('{{orderId}}', newOrder._id);
        emailHtml = emailHtml.replace('{{totalPrice}}', newOrder.totalPrice.toFixed(2));
        emailHtml = emailHtml.replace('{{address}}', newOrder.address);
        emailHtml = emailHtml.replace('{{qrCodeUrl}}', qrCodeUrl); 

        // ✅ Items list ko replace kar
        const itemsHtml = cartItems.map((item, index) => `
                <li>${item.title || `Item No.${index + 1}`} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}</li>
        `).join('');

        emailHtml = emailHtml.replace('<ul></ul>', `<ul>${itemsHtml}</ul>`);


        const emailSubject = 'Order Confirmation';

        await sendEmail(userDoc?.email, emailSubject, emailHtml);

        // After placing the order, clear the user's cart
        await Cart.findOneAndUpdate({ userId }, { products: [] });

        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id; // Correctly get userId from the token

        // Use .populate() on the correct path: 'items.productId'
        const orders = await Order.find({ userId })
            .populate({
                path: 'items.productId',
                select: 'title image'
            })
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json({ orders });

    } catch (error) {
        console.error('Error getting orders by user:', error);
        res.status(500).json({ message: 'Error getting orders by user', error: error.message });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id; // Get userId from the token

        // Find the order and ensure it belongs to the authenticated user
        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Check if the order can be canceled (e.g., status is 'Pending')
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: `Cannot cancel an order that is already '${order.status}'.` });
        }

        // Update the order status to 'Canceled'
        order.status = 'Canceled';
        await order.save();

        res.status(200).json({ message: 'Order canceled successfully.', order });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.deleteAllOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await Order.deleteMany({ userId,
            status: { $in: ['Canceled', 'Failed']}
         });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No orders found to delete.' });
        }

        res.status(200).json({ message: `${result.deletedCount} orders deleted successfully!` });
    } catch (error) {
        console.error('Error deleting all orders:', error);
        res.status(500).json({ message: 'Failed to delete orders.' });
    }
};

 exports.verifyOrder = async (req, res) => {
    try {
        
        const { orderId } = req.params

        
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found', status: 'error' });
        }

        if (order.isVerified) {
            return res.status(200).json({ 
                status: 'warning', 
                message: 'This order has already been verified once. This might be a counterfeit item.' 
            });
        }

        order.isVerified = true;
        await order.save();

        res.status(200).json({ 
            status: 'success', 
            message: 'Order authenticity verified successfully!' 
        });

    } catch (error) {
        console.error('Error verifying order:', error);
        res.status(500).json({ message: 'Internal Server Error', status: 'error' });
    }
};
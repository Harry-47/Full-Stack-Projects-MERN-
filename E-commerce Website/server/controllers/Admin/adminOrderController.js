const Order  = require('../../models/orderSchema');
const { sendEmail } = require('../../configs/nodemailerConfig');
const { User } = require("../../models/userSchema")

const fs = require("fs")
const path = require("path")

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email') 
            .sort({ isVerified: -1 });

        
        res.status(200).json(orders);

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        } 

        const userData = await User.findById(order.userId).select('email name displayName');

        if (!userData || !userData.email) {
            console.error("User data or email not found for order:", orderId);
        } else {
            const userName = userData.name || userData.displayName || 'Customer';
            const userEmail = userData.email;
            const emailSubject = 'Order Status Update';

            // Files ko ek dafa read kar lein
            const successPath = path.join(__dirname, '../', '../', 'Utils', 'Emails', 'orderSuccess.html');
            const canceledPath = path.join(__dirname, '../', '../', 'Utils', 'Emails', 'orderFailed.html');

            let emailBody;

            // ✅ Fix: Use an if/else block for clearer logic and proper assignment
            if (status === "Shipped" || status === "Delivered") {
                let successEmailHTML = fs.readFileSync(successPath, 'utf-8');
                
                // ✅ Fix: Chain the .replace() methods to make sure the changes are saved
                emailBody = successEmailHTML
                    .replace('{{status}}', status)
                    .replace('{{userName}}', userName)
                    .replace('{{orderId}}', order._id)
                    .replace('{{totalPrice}}', order.totalPrice.toFixed(2))
                    .replace('{{address}}', order.address);
            } else if (status === "Canceled") {
                let canceledEmailHTML = fs.readFileSync(canceledPath, 'utf-8');

                // ✅ Fix: Chain the .replace() methods to make sure the changes are saved
                emailBody = canceledEmailHTML
                    .replace('{{userName}}', userName)
                    .replace('{{orderId}}', order._id)
                    .replace('{{totalPrice}}', order.totalPrice.toFixed(2))
                    .replace('{{address}}', order.address);
            }

            // ✅ Fix: Condition ko if block ke andar le aayein
            if (emailBody) {
                await sendEmail(userEmail, emailSubject, emailBody);
            }
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.searchOrders = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({ message: "Search keyword is required." });
        }

        const searchRegex = new RegExp(keyword, 'i'); // Case-insensitive regex

        // Search logic
        const orders = await Order.find({
            $or: [
                { 'name': { $regex: searchRegex } },
                { 'address': { $regex: searchRegex } },
                { 'phone': { $regex: searchRegex } },
                // Numerical searches ko alag handle karna padega
            ]
        });

        // Ab price aur quantity ka logic daalna hai
        const filteredOrders = orders.filter(order => {
            const matchesPrice = !isNaN(parseFloat(keyword)) && order.totalPrice === parseFloat(keyword);
            const matchesQuantity = !isNaN(parseInt(keyword)) && order.items.some(item => item.quantity === parseInt(keyword));
            
            return orders.find(o => o._id === order._id) || matchesPrice || matchesQuantity;
        });

        if (filteredOrders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.status(200).json(filteredOrders);

    } catch (error) {
        console.error("Error searching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

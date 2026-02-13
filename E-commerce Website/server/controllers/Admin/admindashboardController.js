const Order = require('../../models/orderSchema');
const {User} = require('../../models/userSchema');
const Product = require('../../models/productSchema');

exports.getDashboardData = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const adminName = await User.findOne({ role: { $regex: /^admin$/i } }).select('name');


        // **1. Sales Data for Charts**
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    sales: "$totalSales"
                }
            }
        ]);

        // **2. Top Selling Products Data**
        const topSellingProducts = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalSales: { $sum: "$items.quantity" }
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    _id: 0,
                    name: "$productDetails.title",
                    sales: "$totalSales"
                }
            }
        ]);

        // **3. Low Stock Products Data**
        const lowStockProducts = await Product.find({ stock: { $lt: 20 } })
            .sort({ stock: 1 })
            .limit(10)
            .select('title stock');

        // Final data object to send to the frontend
        const dashboardData = {
            adminName: adminName ? adminName.name : 'Admin',
            totalProducts,
            totalOrders,
            totalUsers,
            salesData,
            topSellingProducts,
            lowStockProducts
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: "Server error. Could not fetch dashboard data." });
    }
};




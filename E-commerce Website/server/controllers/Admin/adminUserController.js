const { User } = require('../../models/userSchema');
const Order  = require('../../models/orderSchema');
const { Cart } = require('../../models/cartSchema');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email role createdAt displayName');
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


exports.deleteUserAndOrdersAndCart = async (req, res) => {
  const userEmail = req.body.data;

  try {
    // 1. Check user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Delete all orders by that user
    await Order.deleteMany({ userId: user._id });

    // 3. Delete user's cart 
    await Cart.deleteOne({ userId: user._id });

    // 4. Delete the user
    await User.deleteOne({ email: userEmail });

    res.status(200).json({ message: "User and all related orders deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.searchUsersByName = async (req, res) => {
  const query = req.query.keyword; // Changed from req.params.query
  try {
    const regex = new RegExp(query, 'i');
    const users = await User.find({ name: { $regex: regex } }).select('name email role createdAt');
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

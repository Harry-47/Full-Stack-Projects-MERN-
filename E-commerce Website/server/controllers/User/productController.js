const Product  = require('../../models/productSchema');
const asyncHandler = require('express-async-handler');
const Order = require('../../models/orderSchema');


exports.getSearchProducts = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10, brand, minPrice, maxPrice, rating, discount } = req.query;

        // Build the base filter object
        const filter = {};

        // 1. Add keyword search logic
        if (keyword) {
            const searchRegex = new RegExp(keyword, 'i');
            filter.$or = [
                { title: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } }
            ];
        }

        // 2. Add brand filter
        if (brand) {
            filter.brand = new RegExp(brand, 'i');
        }

        // 3. Add price range filter
         const priceFilter = {};
    if (minPrice && parseFloat(minPrice) > 0) {
      priceFilter.$gte = parseFloat(minPrice);
    }
    if (maxPrice && parseFloat(maxPrice) > 0) {
      priceFilter.$lte = parseFloat(maxPrice);
    }

    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }
        
        // 4. Add rating filter
        if (rating) {
            filter.rating = { $gte: parseFloat(rating) };
        }

        // 5. Add discount filter
        if (discount && parseFloat(discount) > 0) {
            filter.discountPercentage = { $gte: parseFloat(discount) };
        }

        // Handle pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch products that match the constructed filter
        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        // Get the total number of products that match the search
        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, brand, minPrice, maxPrice, rating, discount } = req.query;

    const filter = { category: category };
    
    // Case-insensitive brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    // Only apply if the rating is a positive number
    if (rating && parseFloat(rating) > 0) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    // Only apply if the discount is a positive number
    if (discount && parseFloat(discount) > 0) {
      filter.discount = { $gte: parseFloat(discount) };
    }
    
    // Price filter (remains correct)
    const priceFilter = {};
    if (minPrice && parseFloat(minPrice) > 0) {
      priceFilter.$gte = parseFloat(minPrice);
    }
    if (maxPrice && parseFloat(maxPrice) > 0) {
      priceFilter.$lte = parseFloat(maxPrice);
    }

    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit));
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit)
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getAllProducts = async (req, res) => {
    try {
        
        const products = await Product.find({});
        if (!products || products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ error: "No id provided" });
    }
    try {
        const product = await Product.findById(productId)
            .populate({
                path: 'reviews.userId',
                select: 'name' // Sirf 'name' field chahiye
            });

        if (!product) {
            return res.status(404).json({ message: "error finding product" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.addReviews = asyncHandler(async (req, res) => {
    const { reviews, orderId } = req.body;
    const userID = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    if (order.userId.toString() !== userID.toString()) {
        res.status(401);
        throw new Error('Not authorized to review this order.');
    }

    if (order.status !== 'Delivered') {
        res.status(400);
        throw new Error('Order must be delivered to leave a review.');
    }

    // Check if the order has already been reviewed
    if (order.hasReviewed) {
        res.status(400);
        throw new Error('This order has already been reviewed.');
    }

    // Process each review
    for (const reviewData of reviews) {
        const { productId, rating, review } = reviewData;

        // Find the product and update it
        const product = await Product.findById(productId);
        
        //If product exists then proceed.
        if (product) { 
            // Create new review object
            const newReview = {
                userId: userID,
                rating,
                review
            };

            // Add the new review to the product's reviews array
            product.reviews.push(newReview);

            // Recalculate the average rating
            const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
            product.rating = totalRating / product.reviews.length;

            await product.save();
        } else {
            console.warn(`Product with ID ${productId} not found.`);
            // if a certain product is not found, dont throw error rather continue 
        }
    }

    // Mark the order as reviewed
    order.hasReviewed = true;
    await order.save();

    res.status(200).json({ message: 'Reviews added successfully!' });
});
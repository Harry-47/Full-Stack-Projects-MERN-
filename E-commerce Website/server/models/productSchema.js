// models/Product.js (Revised)
const mongoose = require('mongoose');

// ⭐ Sub-schema for reviews
const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    price: Number,
    image: String,
    brand: String,
    model: String,
    color: String,
    category: String,
    discount: Number,
    onSale: Boolean,
    stock: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    
    rating: {
        type: Number,
        default: 0
    },
   
    reviews: [reviewSchema]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
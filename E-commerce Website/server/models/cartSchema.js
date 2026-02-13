
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product' 
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

exports.Cart = mongoose.model('Cart', cartSchema);
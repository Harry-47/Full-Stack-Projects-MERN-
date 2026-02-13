const {z} = require("zod")

//for user
const reviewSchema = z.object({
    reviews: z.array(z.object({
        rating: z.number().min(1).max(5),
        review: z.string()
    })),
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

//for admin
const productSchema = z.object({
    title: z.string().trim().min(3, "Title msut be a bit long").max(100),
    description: z.string().min(10, "Description should be in more detail"),
    price: z.preprocess((val) => Number(val), z.number().positive("Price must be greater than zero")),
    brand: z.string().min(1, "Brand name is required"),
    model: z.string().min(1, "Model is required"),
    category: z.enum(["Electronics", "Beauty & Care", "Groceries", "Mobiles", "Clothing", "Laptops", "Books", "Accessories", "Home & Garden", "Sports", "Cycling", "Toys & Games", "Footwear", "Baby Products", "Outdoor Gear"], {
        errorMap: () => ({ message: "Select an appropriate category!" })
    }),
    discount: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(100)),
    rating: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(5)),
    stock: z.preprocess((val) => Number(val), z.number().int().min(0, "Stock cannot be negative")),
    onSale: z.preprocess((val) => val === 'true' || val === true, z.boolean())
});

const editProductSchema = productSchema.partial();

module.exports = { productSchema, editProductSchema, reviewSchema };

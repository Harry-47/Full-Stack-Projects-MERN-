const {z} = require("zod")

const singleUpdateSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  quantity: z.number().min(1)
});

const bulkUpdateSchema = z.object({
  cartItems: z.array(z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    quantity: z.number().min(1)
  })).min(1)
});

const flexibleCartSchema = z.union([singleUpdateSchema, bulkUpdateSchema]);

module.exports = { flexibleCartSchema };
const { z } = require("zod");

exports.placementSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 letters"),
  address: z
    .string()
    .trim()
    .min(10, "Address is too short")
    .max(150, "Address is too long"),
  phone: z
    .string()
    .max(11, "Your contact number does not contain 11 digits")
    .regex(/^\d+$/),
  cartItems: z.array(
    z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
      quantity: z.number(),
      price: z.number(),
      name: z.string(),
    }),
    "items must be in an array!",
  ),
});

const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["user", "admin"], { errorMap: () => ({ message: "Invalid role" }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error confirmPassword field pe dikhega
});

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const passwordResetSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema, passwordResetSchema };
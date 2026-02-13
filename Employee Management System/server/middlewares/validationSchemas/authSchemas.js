const { z, number } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  number: z.string().length(11, "Number must be exactly 11 characters").optional().or(z.literal("")),
  bio: z.string().max(300, "Bio must be at most 300 characters").optional().or(z.literal("")),
  role: z.enum(["employee", "manager"], { 
    errorMap: () => ({ message: "Invalid role. Choose 'employee' or 'manager'" }) 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const passwordResetSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema, passwordResetSchema };
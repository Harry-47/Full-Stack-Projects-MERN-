const {z} = require("zod");

const createTaskSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Use YYYY-MM-DD",
    }),
    category: z.enum(['Development', 'Design', 'Marketing', 'Testing', 'HR'], {
        errorMap: () => ({ message: "Invalid category. Choose from Development, Design, Marketing, Testing, HR" })
    }),
    assignedTo: z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
        message: "Invalid user ID format"
    }),
});

const submitTaskSchema = z.object({
    message: z.string().min(5, "Submission message must be at least 5 characters"),
}); 

module.exports = { createTaskSchema, submitTaskSchema };
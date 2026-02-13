const { rateLimit} = require("express-rate-limit")

const loginLimiter =  
    rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 3 requests per `window` because of multiple suspicious attempts to login
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    handler: (req, res)=> {
        return res.status(429).json({
            success: false,
            error: "Too many requests!",
            data: []
        })
    }
})

const resetLimiter = 
        rateLimit({
    windowMs: 24 * 60  * 60 * 1000, // 1 Day
	limit: 3, // Limit each IP to 3 requests per `window` because of multiple suspicious attempts to login
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    handler: (req, res)=> {
        return res.status(429).json({
            success: false,
            error: "Too many requests!",
            data: []
        })
    }
})
module.exports = { loginLimiter, resetLimiter }
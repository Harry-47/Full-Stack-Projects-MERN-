const { schema } = require("../models/orderSchema")

exports.validateProduct = (schema) => (

    (req,res,next) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            return res.status(400).json({
                success: false,
                msg: error.message || "Validation failed",
                data: []
            })
        }
    }
)


exports.validateAddition = (schema) => (

    (req, res, next)=> {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            return res.status(400).json({
                success: false,
                msg: error.message || "Validation failed",
                data: []
            })
        }
    })
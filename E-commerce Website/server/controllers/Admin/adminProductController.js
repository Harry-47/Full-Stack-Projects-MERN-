const Product = require('../../models/productSchema');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if(!products || products.length === 0){
        return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(products);
    } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });   
    }   
}
exports.getSearchProducts = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10, brand, minPrice, maxPrice, rating, discount } = req.query;

        const filter = {};
        if (keyword) {
            const searchRegex = new RegExp(keyword, 'i');
            filter.$or = [
                { title: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } }
            ];
        }

        if (brand) {
            filter.brand = new RegExp(brand, 'i');
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }
        
        if (rating) {
            filter.rating = { $gte: parseFloat(rating) };
        }

        if (discount) {
            filter.discountPercentage = { $gte: parseFloat(discount) };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (error) {
        console.error("Error fetching admin search results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(product);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


exports.addProduct = async (req, res) => {
    const { title, description, price, brand, model, color, category, discount, rating, onSale, stock} = req.body;
    let image;

    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }
        image = req.file.path; // Cloudinary URL from multer-storage-cloudinary

        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            image,
            brand,
            model,
            color,
            category,
            discount: Number(discount) || 0,
            rating: Number(rating) || 0,
            onSale: onSale === 'true' || onSale === true,
            stock
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, brand, model, color, category, discount, rating, onSale } = req.body;

    console.log("File received:", req.file); // Debug: Check file
    console.log("Body:", req.body); // Debug: Check form data

    const updatedFields = {
        title,
        description,
        price: Number(price),
        brand,
        model,
        color,
        category,
        discount: Number(discount) || 0,
        rating: Number(rating) || 0,
        onSale: onSale === 'true' || onSale === true
    };

    if (req.file) {
        updatedFields.image = req.file.path; // Cloudinary URL
        console.log("Uploading to Cloudinary:", req.file.path);
    }

    try {
        const updated = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product updated", product: updated });
    } catch (err) {
        console.error("❌ Error editing product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getByCategory = async (req, res) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10, brand, minPrice, maxPrice, rating, discount } = req.query;

        const filter = { category: type };
        const priceFilter = {};

        if (brand) {
            filter.brand = { $regex: brand, $options: 'i' };
        }

        if (rating && parseFloat(rating) > 0) {
            filter.rating = { $gte: parseFloat(rating) };
        }

        if (discount && parseFloat(discount) > 0) {
            filter.discountPercentage = { $gte: parseFloat(discount) };
        }
        
        if (minPrice && parseFloat(minPrice) > 0) {
            priceFilter.$gte = parseFloat(minPrice);
        }
        if (maxPrice && parseFloat(maxPrice) > 0) {
            priceFilter.$lte = parseFloat(maxPrice);
        }

        if (Object.keys(priceFilter).length > 0) {
            filter.price = priceFilter;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit));
        
        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
        });

    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
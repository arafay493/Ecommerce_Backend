const Product = require("../models/product.model");

// Create and Save a new Product
const createProductController = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.title) {
      res.status(400);
      throw new Error("Name must be provided.");
    }
    if (!req.body.slug) {
      res.status(400);
      throw new Error("Slug must be provided.");
    }
    if (!req.body.price) {
      res.status(400);
      throw new Error("Price must be provided.");
    }
    if (!req.body.quantity) {
      res.status(400);
      throw new Error("Quantity must be provided.");
    }
    if (!req.body.category) {
      res.status(400);
      throw new Error("Category must be provided.");
    }
    if (!req.body.description) {
      res.status(400);
      throw new Error("Description must be provided.");
    }
    // Check if product already exists
    const productExists = await Product.findOne({ slug: req.body.slug });
    if (productExists) {
      res.status(400);
      throw new Error("Product with the same name already exists.");
    }
    // Create a Product object
    const newProduct = new Product(req.body);
    const data = await newProduct.save();
    res.status(201);
    res.locals.message = "Product created successfully";
    res.locals.data = data;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { createProductController };

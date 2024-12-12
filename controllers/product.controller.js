const { default: mongoose } = require("mongoose");
const Product = require("../models/product.model");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//? Create and Save a new Product
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

//? Get all products without pagination
const getAllProductsController = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200);
    res.locals.message = "Products list fetched successfully!";
    res.locals.data = products;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

//? Get All Products with Paginations
const getAllProductsWithPaginationController = async (req, res, next) => {
  try {
    // Pagination
    // const { page = 1, limit = 10 } = req.query;
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    // Find products
    const products = await Product.find().skip(startIndex).limit(endIndex);

    res.status(200);
    res.locals.message = "Products list fetched successfully!";
    res.locals.data = {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      shownProducts: products.length,
      totalProducts: total,
    };
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

//? Get Single product Controller
const getProductController = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400);
      throw new Error("Product ID must be provided.");
    }
    validateMongoDbId(id, res);

    // Find product by ID
    const product = await Product.findById(id);
    // const product = await Product.findOne({ _id: id });
    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }
    res.status(200);
    res.locals.message = "Product retrieved successfully";
    res.locals.data = product;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

//? Get Single product Controller with Params Id
const getSingleProductWithParamsIdController = async (req, res, next) => {
  try {
    // Validate ID (using path parameter or query parameter)
    const { id } = req.params;
    console.log(id);
    if (!id) {
      res.status(400);
      throw new Error("Product ID must be provided.");
    }
    // validateMongoDbId(id, res);

    // Find product by ID
    const product = await Product.findById(id);
    // const product = await Product.findOne({ _id: id });
    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }
    res.status(200);
    res.locals.message = "Product retrieved successfully";
    res.locals.data = product;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  getAllProductsWithPaginationController,
  getProductController,
  getSingleProductWithParamsIdController,
};

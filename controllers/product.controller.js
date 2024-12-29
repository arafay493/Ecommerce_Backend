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

//? Get all products query parameters: Method 1
// const getAllProductsOfQueryParamertersController = async (req, res, next) => {
//   try {
//     const products = await Product.find(req.query);
//     res.status(200);
//     res.locals.message = "Products list fetched successfully!";
//     res.locals.data = products;
//     res.locals.headersSend = true;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

//? Get all products query parameters: Method 2
const getAllProductsOfQueryParamertersController = async (req, res, next) => {
  try {
    //todo: Method 1
    // const initialQuery = {...req.query}
    // // List of keys to remove
    // const keysToRemove = ["page", "sort", "limit", "fields"];
    // // Create a filtered query by removing unwanted keys
    // const filteredQuery = Object.keys(initialQuery)
    //   .filter((key) => !keysToRemove.includes(key))
    //   .reduce((obj, key) => {
    //     obj[key] = initialQuery[key];
    //     return obj;
    //   }, {});
    // console.log(filteredQuery);
    
    //todo: Method 2
    // const initialQuery = {...req.query}
    // // List of keys to remove
    // const keysToRemove = ["page", "sort", "limit", "fields"];
    
    // // Remove unwanted keys
    // keysToRemove.forEach((key) => {
    //   delete initialQuery[key];
    // });
    // console.log(initialQuery);

    //todo: Method 3
    const { page, sort, limit, fields, ...filteredQuery } = req.query;
    console.log(filteredQuery);

    const products = await Product.where("brand").equals(req.query.brand);
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

//? Update Product Controller
// const updateProductController = async (req, res, next) => {
//   try {
//     const { id } = req.query;
//     if (!id) {
//       res.status(400);
//       throw new Error("Product ID must be provided.");
//     }
//     validateMongoDbId(id, res);
//     // Find product by ID
//     const product = await Product.findById(id);
//     // const product = await Product.findOne({ _id: id });
//     if (!product) {
//       res.status(404);
//       throw new Error("Product not found.");
//     }
//     // Update product fields
//     product.title = req.body.title || product.title;
//     product.slug = req.body.slug || product.slug;
//     product.price = req.body.price || product.price;
//     product.quantity = req.body.quantity || product.quantity;
//     product.category = req.body.category || product.category;
//     product.description = req.body.description || product.description;
//     // Save updated product
//     const updatedProduct = await product.save();
//     res.status(200);
//     res.locals.message = "Product updated successfully";
//     res.locals.data = updatedProduct;
//     res.locals.headersSend = true;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

//? Update Product Controller
const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400);
      throw new Error("Product ID must be provided.");
    }
    validateMongoDbId(id, res);
    // Find product by ID
    // const product = await Product.findById(id);
    const prevProduct = await Product.findById(id, {
      updatedAt: 0,
      createdAt: 0,
    });
    if (!prevProduct) {
      res.status(404);
      throw new Error("Product not found.");
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      projection: { updatedAt: 0, createdAt: 0 },
    });
    // Convert to plain objects and compare
    if (
      JSON.stringify(prevProduct.toObject()) ===
      JSON.stringify(updatedProduct.toObject())
    ) {
      res.status(409); // Conflict
      throw new Error("No changes made to this product.");
    }
    // const product = await Product.findOne({ _id: id });
    if (!updatedProduct) {
      res.status(404);
      throw new Error("Product not found.");
    }
    //     // Update product fields
    //     product.title = req.body.title || product.title;
    //     product.slug = req.body.slug || product.slug;
    //     product.price = req.body.price || product.price;
    //     product.quantity = req.body.quantity || product.quantity;
    //     product.category = req.body.category || product.category;
    //     product.description = req.body.description || product.description;
    // Save updated product
    // const updatedProduct = await product.save();
    res.status(200);
    res.locals.message = "Product updated successfully";
    res.locals.data = updatedProduct;
    // res.locals.data = product;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

//? Delete Product Controller
const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400);
      throw new Error("Product ID must be provided.");
    }
    validateMongoDbId(id, res);
    //todo: Method 1 : Find product by ID
    // const product = await Product.findById(id);
    // const product = await Product.findOne({ _id: id });
    // if (!product) {
    //   res.status(404);
    //   throw new Error("Product not found.");
    // }
    // Delete product
    // await product.deleteOne({ _id: id });
    //todo: Method 2 : Find product by ID And Delete product
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }
    const response = await Product.findByIdAndDelete(id);
    res.status(200);
    res.locals.message = "Product deleted successfully";
    // res.locals.data = product;
    res.locals.data = response;
    res.locals.headersSend = true;
    next();
  } catch (error) {
    next(error);
  }
};

//? Get All Products with infinite scroll or see more button

module.exports = {
  createProductController,
  getAllProductsController,
  getAllProductsWithPaginationController,
  getProductController,
  getSingleProductWithParamsIdController,
  updateProductController,
  deleteProductController,
  getAllProductsOfQueryParamertersController,
};

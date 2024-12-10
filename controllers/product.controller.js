const Product = require("../models/product.model");

// Create and Save a new Product
const createProductController = async (req, res, next) => {
  // Validate request
  // ...
  res.send({message: "Product created successfully!"})

  // Create a Product object
//   const newProduct = new Product({
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//     category: req.body.category,
//     quantity: req.body.quantity,
//     image: req.body.image,
//   });

//   // Save the Product in the database
//   try {
//     const data = await newProduct.save();
//     res.status(201).send({ message: "Product created successfully!", data });
//   } catch (error) {
//     res.status(400).send({ message: error.message });
//   }
};

module.exports = {createProductController};

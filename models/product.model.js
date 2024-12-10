const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      enum: ["Apple", "BlackBerry", "Samsung", "Lenovo"],
      // match: /^[a-zA-Z ]{3,}$/,
      // default: "Unknown",
    },
    sold: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
      trim: true,
      // match: /https?:\/\/\S+\.(jpg|jpeg|png)/,
    },
    color: {
      type: String,
      required: true,
      enum: ["black", "brown", "red"],
      default: "black",
      trim: true,
      // match: /^#[0-9A-F]{6}$/i,
      // default: "#000000",
    },
    rating: {
      Star: Number,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      required: true,
      min: 1,
      max: 5,
      default: 0,
    },
    //   rating:{
    //     type: Number,
    //     required: true,
    //     min: 1,
    //     max: 5,
    //     default: 0,
    //   },
    //   stock: {
    //     type: String,
    //     required: true,
    //   },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
      // items: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Product",
      // },
    },
    addresses: {
      // type: Array,
      // default: [],
      // items: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Address",
      // },
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      // items: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Product",
      // },
    },
  },
  {
    timestamps: true,
    // strict: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

userSchema.methods.isPasswordMatched = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  // const user = this.toObject();
  // delete user.password;
  // const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
  //   expiresIn: "1h",
  // });
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1min",
  });
  return token;
};

//Export the model
module.exports = mongoose.model("User", userSchema);

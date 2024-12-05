const mongoose = require("mongoose");
const validateMongoDbId = (id, res) => {
  // return {
  //     validator: (v) => mongoose.Types.ObjectId.isValid(v),
  //     message: (props) => `${props.path} is not a valid ObjectId`,
  // };
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    res.status(400); // Bad Request
    throw new Error("Invalid User ID.");
  }
};
module.exports = {validateMongoDbId};

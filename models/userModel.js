const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  unit: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    unique: true,
  },
  access: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  level_1: {
    type: String,
    required: true,
  },
  level_2: {
    type: String,
    required: true,
  },
  level_3: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("users", userSchema);

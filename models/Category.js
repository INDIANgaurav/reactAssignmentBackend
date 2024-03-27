const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: { type: "string" },

  name: { type: "string" },
});

module.exports = mongoose.model("Category", categorySchema);
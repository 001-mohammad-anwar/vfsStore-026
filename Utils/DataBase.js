const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI

// Connect to MongoDB without deprecated options
const connectDb = async () => {
  try {
    await mongoose.connect(URI)
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(0);
  }
};

module.exports = connectDb;

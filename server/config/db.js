const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/adaptive_learning";

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    if (process.env.MONGO_URI) {
      console.error("Verify your MongoDB Atlas URI, network access, and IP whitelist.");
    } else {
      console.error("Unable to connect to local MongoDB. Start MongoDB or set MONGO_URI in .env.");
    }
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const dns = require("dns");

// Fix DNS resolution for serverless environments
dns.setDefaultResultOrder("ipv4first");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      family: 4, // Force IPv4
      maxPoolSize: 1, // Reduce connections for serverless
      retryWrites: true,
      w: "majority",
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (err) {
    cached.promise = null; // reset on failure
    console.error("MongoDB connection failed:", err.name, err.message);
    if (err.reason) {
      console.error("Topology:", err.reason.type);
      err.reason.servers?.forEach((desc, host) => {
        console.error(`  ${host}: ${desc.error?.message || desc.type}`);
      });
    }
    throw err; // Throw so caller knows connection failed
  }
}

module.exports = connectDB;

import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    throw new Error("DB connection failed");
  }
};


let client = new MongoClient(MONGODB_URI);
let clientPromise = client.connect();

export default clientPromise;
import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("Missing mongodb URL");

  if (isConnected) return console.log("Mongodb already connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devOverflow",
    });

    isConnected = true;
    console.log("Mongodb is connected");
  } catch (error: any) {
    console.log("Mongodb connection failed ", error);
  }
};

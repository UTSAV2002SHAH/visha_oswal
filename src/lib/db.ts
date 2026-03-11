import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (err: any) {
    console.error(err.message);
    // In a serverless environment, throwing the error is better than exiting the process
    throw new Error('Database connection failed');
  }
};

export default connectDB;
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//May need if using mobile hotspot while development
// import dns from 'dns/promises';
// dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({});
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}
export default async function dbConnect() {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log('✅Connected to MongoDB');
  } catch (error) {
    console.error('❌Could not connect to MongoDB', error);
  }
}

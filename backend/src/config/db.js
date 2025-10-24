import mongoose from 'mongoose';

// Vercel-optimized database connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in Vercel'
  );
}

// Serverless connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If connection already exists, reuse it
  if (cached.conn) {
    console.log('✅ Using existing database connection');
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      maxPoolSize: 1, // Smaller pool for serverless
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Creating new database connection...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Database connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
        cached.promise = null; // Reset on failure
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectDB;
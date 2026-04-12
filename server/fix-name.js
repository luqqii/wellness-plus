import mongoose from 'mongoose';
import User from './src/models/User.js';
import env from './src/config/env.js';

async function fixName() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to DB');
    
    const result = await User.updateMany(
      { name: 'Test User' }, 
      { $set: { name: 'Alex' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users to Alex.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixName();

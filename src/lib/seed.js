import connectDB from './db.js';
import User from '../models/User.js';

/**
 * Seed initial owner user
 * Run this once to create the first admin user
 */
async function seed() {
  try {
    await connectDB();

    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' });
    if (existingOwner) {
      console.log('Owner user already exists');
      return;
    }

    // Create owner user
    const owner = new User({
      email: 'owner@salon.com',
      password: 'admin123', // Will be hashed by pre-save hook
      name: 'Salon Owner',
      role: 'owner',
    });

    await owner.save();
    console.log('Owner user created successfully!');
    console.log('Email: owner@salon.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('seed.js')) {
  seed();
} else {
  // Export for use as module
  export default seed;
}

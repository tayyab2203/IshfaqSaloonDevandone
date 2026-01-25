import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.error('Please create a .env.local file with MONGODB_URI=your_connection_string');
  process.exit(1);
}

// User Schema (simplified for seed script)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['owner', 'staff'], required: true, default: 'staff' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' });
    if (existingOwner) {
      console.log('Owner user already exists');
      console.log('Email:', existingOwner.email);
      await mongoose.disconnect();
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
    console.log('\n✅ Owner user created successfully!');
    console.log('Email: owner@salon.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login.\n');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();

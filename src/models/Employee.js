import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['barber', 'stylist', 'receptionist', 'manager'],
    required: true,
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
employeeSchema.index({ status: 1 });
employeeSchema.index({ userId: 1 });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;

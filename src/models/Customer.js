import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
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
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  lastVisit: {
    type: Date,
    default: null,
  },
  preferredEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  isDue: {
    type: Boolean,
    default: false,
  },
  lastReminderSent: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
customerSchema.index({ phone: 1 }, { unique: true });
customerSchema.index({ isDue: 1 });
customerSchema.index({ lastVisit: 1 });

// Virtual for full name display
customerSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if customer is due for reminder (25-30 days)
customerSchema.methods.checkIfDue = function() {
  if (!this.lastVisit) {
    this.isDue = false;
    return false;
  }
  
  const daysSinceLastVisit = Math.floor((new Date() - this.lastVisit) / (1000 * 60 * 60 * 24));
  this.isDue = daysSinceLastVisit >= 25 && daysSinceLastVisit <= 30;
  return this.isDue;
};

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;

import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    required: true,
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  saleDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
saleSchema.index({ saleDate: 1 });
saleSchema.index({ employeeId: 1 });
saleSchema.index({ customerId: 1 });
saleSchema.index({ paymentMethod: 1 });

// Virtual for commission amount
saleSchema.virtual('commission', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

// Method to calculate commission
saleSchema.methods.getCommission = async function() {
  const Employee = mongoose.model('Employee');
  const employee = await Employee.findById(this.employeeId);
  if (!employee) return 0;
  return (this.finalAmount * employee.commissionRate) / 100;
};

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale;

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  }],
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  bookingType: {
    type: String,
    enum: ['online', 'walk-in'],
    default: 'online',
  },
  notes: {
    type: String,
    default: '',
  },
  // Advance Payment Fields
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  advanceAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Reschedule Fields
  rescheduleCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  rescheduledFrom: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ employeeId: 1 });

// Virtual for total duration (calculated from services)
bookingSchema.virtual('totalDuration', {
  ref: 'Service',
  localField: 'serviceIds',
  foreignField: '_id',
  justOne: false,
});

// Method to calculate total duration
bookingSchema.methods.getTotalDuration = async function() {
  const Service = mongoose.model('Service');
  const services = await Service.find({ _id: { $in: this.serviceIds } });
  return services.reduce((total, service) => total + (service.duration || 0), 0);
};

// Method to calculate total price
bookingSchema.methods.getTotalPrice = async function() {
  const Service = mongoose.model('Service');
  const services = await Service.find({ _id: { $in: this.serviceIds } });
  return services.reduce((total, service) => total + (service.price || 0), 0);
};

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;

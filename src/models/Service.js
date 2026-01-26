import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    trim: true,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 15, // Minimum 15 minutes
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index
serviceSchema.index({ isActive: 1 });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;

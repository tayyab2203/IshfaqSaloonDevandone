import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Salon Information
  salonName: {
    type: String,
    default: 'Ishfaq Mens Salon',
  },
  logo: {
    type: String,
    default: '',
    trim: true,
  },
  salonAddress: {
    type: String,
    default: '',
  },
  salonPhone: {
    type: String,
    default: '+92 300 1234567',
  },
  
  // Working Hours
  openingTime: {
    type: String,
    default: '09:00',
  },
  closingTime: {
    type: String,
    default: '18:00',
  },
  closedDays: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  }],
  
  // WhatsApp Integration
  whatsappNumber: {
    type: String,
    default: '+92 300 1234567',
  },
  
  // Default Commission Rate
  defaultCommissionRate: {
    type: Number,
    default: 20,
    min: 0,
    max: 100,
  },
  
  // Advance Payment Settings
  advancePaymentEnabled: {
    type: Boolean,
    default: false,
  },
  advancePercentage: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this({});
    await settings.save();
  }
  return settings;
};

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;

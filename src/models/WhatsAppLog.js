import mongoose from 'mongoose';

const whatsAppLogSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    default: 'sent',
  },
}, {
  timestamps: true,
});

// Indexes
whatsAppLogSchema.index({ bookingId: 1 });
whatsAppLogSchema.index({ sentAt: -1 });
whatsAppLogSchema.index({ phone: 1 });

const WhatsAppLog = mongoose.models.WhatsAppLog || mongoose.model('WhatsAppLog', whatsAppLogSchema);

export default WhatsAppLog;

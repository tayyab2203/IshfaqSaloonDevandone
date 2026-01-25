import mongoose from 'mongoose';

const dailySummarySchema = new mongoose.Schema({
  summaryDate: {
    type: Date,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  cashSales: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  onlineSales: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  totalClients: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  topEarner: {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    employeeName: {
      type: String,
      default: '',
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  summaryData: {
    type: String,
    default: '',
  },
  sentViaWhatsApp: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index
dailySummarySchema.index({ summaryDate: 1 }, { unique: true });

const DailySummary = mongoose.models.DailySummary || mongoose.model('DailySummary', dailySummarySchema);

export default DailySummary;

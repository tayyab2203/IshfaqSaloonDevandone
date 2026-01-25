import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true,
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;

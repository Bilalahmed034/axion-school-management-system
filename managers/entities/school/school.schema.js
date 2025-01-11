const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    unique: true
  },
  location: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  administrators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  contactNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

schoolSchema.virtual('classrooms', {
  ref: 'Classroom',
  localField: '_id',
  foreignField: 'school'
});

module.exports = mongoose.model('School', schoolSchema);

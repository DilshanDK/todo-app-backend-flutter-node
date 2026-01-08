import mongoose from 'mongoose';

// Helper to format date to Sri Lankan timezone string
const toSriLankanTimeString = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString('en-GB', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
};

const todoSchema = new mongoose.Schema({
  todo_title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  todo_desc: {
    type: String,
    default: '',
    trim: true,
  },
  todo_date: {
    type: Date,
    default: Date.now,
  },
  todo_status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` before each save
todoSchema.pre('save', function () {
  this.updatedAt = new Date();
});

// Update `updatedAt` before findOneAndUpdate
todoSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

// Transform output to show Sri Lankan time directly
todoSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.todo_date = toSriLankanTimeString(ret.todo_date);
    ret.createdAt = toSriLankanTimeString(ret.createdAt);
    ret.updatedAt = toSriLankanTimeString(ret.updatedAt);
    delete ret.__v; // Remove version key
    return ret;
  },
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;

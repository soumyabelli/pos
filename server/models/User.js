import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      sparse: true // allows nulls if old admin accounts don't have it
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    mobile: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 3,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user', 'worker'],
      default: 'user'
    },
    subRole: {
      type: String, // E.g., 'Cashier', 'Billing Staff', 'Inventory Staff', 'Service Staff', 'Support Staff'
      default: 'Cashier'
    },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night', 'Flexible'],
      default: 'Flexible'
    },
    store: {
      type: String,
      required: true,
      default: 'Main Store'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-generate employee ID before saving if it's a regular user and doesn't have one
userSchema.pre('save', async function() {
  if (this.isModified('username') && this.username) {
    this.username = this.username.toLowerCase().trim();
  }

  if (this.isNew && (this.role === 'user' || this.role === 'worker') && !this.employeeId) {
    this.employeeId = 'EMP-' + Math.floor(1000 + Math.random() * 9000); // Ex: EMP-4821
  }

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

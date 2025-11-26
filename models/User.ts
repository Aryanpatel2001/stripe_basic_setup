import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  stripeCustomerId: { type: String, unique: true, sparse: true },
  stripeSubscriptionId: { type: String },
  subscriptionStatus: { 
    type: String, 
    default: 'inactive' // 'trialing', 'active', 'past_due', 'canceled'
  },
  planId: { type: String },
  trialEndsAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);


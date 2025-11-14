import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24h expiry
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Session", sessionSchema);

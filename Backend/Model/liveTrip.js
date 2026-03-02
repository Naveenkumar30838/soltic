import mongoose from "mongoose";

const roadmapStepSchema = new mongoose.Schema({
  stepId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["departure", "travel", "stay", "explore", "return"],
    required: true
  },
  plannedAt: { type: Date },
  completed: { type: Boolean, default: false },
  meta: {
    location: String,
    mode: String,
    estTime: String,
    bookingLink: String
  }
}, { _id: false });

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: {
    type: String,
    enum: ["ai", "user", "system", "external"],
    required: true
  },
  message: { type: String, required: true },
  meta: { type: Object }
}, { _id: false });

const userActionSchema = new mongoose.Schema({
  stepId: { type: String, required: true },
  action: { type: String, required: true },
  confirmedAt: { type: Date, default: Date.now }
}, { _id: false });

const liveTripSchema = new mongoose.Schema({
  liveTripId: { type: String, required: true, unique: true }, // UUID
  tripId: { type: String, required: true },                   // MySQL TRIPS.ID
  ownerUsername: { type: String, required: true },

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  },

  roadmap: [roadmapStepSchema],
  currentStepIndex: { type: Number, default: 0 },

  logs: [logSchema],
  userActions: [userActionSchema],

  aiContext: {
    lastPrompt: String,
    lastResponse: String,
    memory: { type: Array, default: [] }
  }

}, { timestamps: true });

export default mongoose.model("LiveTrip", liveTripSchema);

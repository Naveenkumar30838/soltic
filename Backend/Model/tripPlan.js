import mongoose from "mongoose";

const planStepSchema = new mongoose.Schema({
  stepId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    enum: [
      "departure",
      "travel",
      "stay",
      "explore",
      "return"
    ],
    required: true
  },

  plannedAt: {
    type: Date
  },

  meta: {
    location: String,
    mode: String,
    estTime: String,
    bookingLink: String
  }

}, { _id: false });

const tripPlanSchema = new mongoose.Schema({

  tripId: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true
  },

  version: {
    type: Number,
    default: 1
  },

  roadmap: {
    type: [planStepSchema],
    default: []
  },

  generatedBy: {
    type: String,
    default: "gemini"
  },

  lastEditPrompt: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: [
      "draft",
      "approved",
      "active",
      "completed"
    ],
    default: "draft"
  }

}, {
  timestamps: true
});

export default mongoose.model(
  "TripPlan",
  tripPlanSchema
);
import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    preferences: {
      learningLanguage: {
        type: String,
        default: "en",
      },
      currentLevel: {
        type: String,
        default: "beginner",
      },
      goals: {
        type: String,
      },
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

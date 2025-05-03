import { Webhook } from "svix";
import User from "../models/user.model.js";
import { generateMilestones } from "../utils/generateMilestones.js";

export const syncUser = async (req, res) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const payloadString = req.body.toString("utf8");
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payloadString, headers);

    const { type, data } = evt;
    console.log("Verified event type:", type);

    if (type === "user.created" || type === "user.updated") {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "User synced successfully" });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    res.status(400).json({ error: "Invalid signature" });
  }
};

export const onboardUser = async (req, res) => {
  try {
    const { learningLanguage, currentLevel, goals } = req.body;

    const preferences = { learningLanguage, currentLevel, goals };
    const milestones = generateMilestones(preferences);

    const user = await User.findOneAndUpdate(
      { clerkId: req.userId },
      {
        isOnboarded: true,
        preferences,
        milestones,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "User onboarded successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error", error });
  }
};

export const getUserMilestones = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ milestones: user.milestones });
  } catch (error) {
    console.error("Error fetching user milestones:", error);
    return res.status(500).json({ error: "Server error", error });
  }
};

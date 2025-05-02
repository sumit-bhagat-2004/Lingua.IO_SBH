import { Webhook } from "svix";
import User from "../models/user.model.js";

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

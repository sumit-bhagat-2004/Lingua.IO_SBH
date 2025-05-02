import { Webhook } from "svix";
import User from "../models/user.model.js";

export const syncUser = async (req, res) => {
  const CLERK_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (error) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    await User.findOneAndUpdate(
      {
        clerkId: data.id,
      },
      {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  return res.status(200).json({ message: "User synced successfully" });
};

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.decode(token);
    req.userId = payload.sub;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

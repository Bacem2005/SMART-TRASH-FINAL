import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ success: false, message: "No token" });

  const token = header.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token format invalid" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;     // ← المهم هذا

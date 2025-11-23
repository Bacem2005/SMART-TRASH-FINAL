import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendMail } from "../mailer.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Missing fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    sendMail(email, "Welcome to SMART TRASH!", "Bienvenue!").catch(console.error);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Register error" });
  }
};

export const login = async (req, res) => {       // ← مهم برشا
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ success: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(400).json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  res.json({ success: true, token, user });
};

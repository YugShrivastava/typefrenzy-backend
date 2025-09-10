import type { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model.js";
import isEmailValid from "../services/isEmailValid.js";
import { validateEmail, validatePassword } from "../utils/validator.js";

const registerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.body.username?.trim() || "";
    const email = req.body.email?.trim() || "";
    const password = req.body.password?.trim() || "";

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    if (username.includes(" ")) {
      return res
        .status(400)
        .json({ error: true, message: "Username must not contain spaces" });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: true,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    const { deliverability, is_valid_format, is_smtp_valid, error } =
      await isEmailValid(email);
    if (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
    if (
      deliverability === "UNDELIVERABLE" ||
      (!is_valid_format.value && !is_smtp_valid.value)
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter a valid email address" });
    }

    const [usernameConflict, emailConflict] = await Promise.all([
      UserModel.findOne({ username }),
      UserModel.findOne({ email }),
    ]);

    if (usernameConflict) {
      return res
        .status(400)
        .json({ error: true, message: "Username already taken" });
    }
    if (emailConflict) {
      return res
        .status(400)
        .json({ error: true, message: "Email already taken" });
    }

    req.body = { username, email, password };

    return next();
  } catch (err) {
    console.error("Register middleware error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
};

const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;
  req.body.username = user.username?.trim();
  req.body.password = user.password?.trim();

  const { username, password } = req.body;
  console.log({ username, password });

  if (!username.trim())
    return res.status(400).json({ error: true, message: "username required" });
  if (!password.trim())
    return res.status(400).json({ error: true, message: "password required" });

  return next();
};

const verificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (header === undefined)
    return res.status(400).json({ error: true, message: "no token received" });
  const token: string = header.split("Bearer ")[1]?.trim() || "";
  if (token.length === 0)
    return res.status(400).json({ error: true, message: "no token received" });

  req.body = token;
  return next();
};

export { registerMiddleware, loginMiddleware, verificationMiddleware };

import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.js";
export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    console.log("Hit:sign-up");

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: { id: user.id, name, email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function signin(req, res) {
  try {
    console.log("Hit:sign-in");

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      success: true,
      message: "Successfully Logged In!",
      user: { id: user.id, name: user.name, email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
export function signout(req, res) {
  try {
    console.log("Hit:sign-out");

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "logged failed! fatal error!" });
  }
}
export async function getAuthUser(req, res) {
  try {
    console.log("Hit:authuser-get");

    res.status(200).json({
      success: true,
      message: "State synced!",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

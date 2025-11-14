import express from "express";
import { v4 as uuidv4 } from "uuid";
import { conn } from "../config/db.js";
import Session from "../Model/session.js";

const router = express.Router();

/* ===========================
   LOGIN ROUTE
   =========================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists in MySQL
    const [rows] = await conn.execute(
      "SELECT * FROM PROFILE WHERE USERNAME = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        status: "user_not_found",
        message: "No user found with this username",
      });
    }

    const user = rows[0];

    // Check for any active session in MongoDB
    const existingSession = await Session.findOne({ username });
    if (existingSession) {
      return res.status(400).json({
        status: "already_logged_in",
        message: "User is already logged in from another session",
      });
    }

    // Create a new session
    const sessionId = uuidv4();
    req.session.username = user.USERNAME;
    req.session.sessionId = sessionId;

    await Session.create({
      sessionId,
      username: user.USERNAME,
      createdAt: new Date(),
    });

    // Respond success
    return res.status(200).json({
      status: "login_success",
      message: "User logged in successfully",
      data: {
        username: user.USERNAME,
        sessionId,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: "server_error",
      message: "Internal server error during login",
    });
  }
});

/* ===========================
   LOGOUT ROUTE
   =========================== */
router.post("/logout", async (req, res) => {
  try {
    const { sessionId } = req.session;

    if (!sessionId) {
      return res.status(400).json({
        status: "no_active_session",
        message: "No active session found to logout",
      });
    }

    // Remove from MongoDB
    await Session.deleteOne({ sessionId });

    // Destroy express-session
    req.session.destroy(() => {
      return res.status(200).json({
        status: "logout_success",
        message: "User logged out successfully",
      });
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      status: "server_error",
      message: "Internal server error during logout",
    });
  }
});

/* ===========================
   SIGNUP ROUTE
   =========================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, username, country, age, email, mob } = req.body;

    // Validate required fields
    if (!name || !username || !email || !mob) {
      return res.status(400).json({
        status: "missing_fields",
        message: "Please provide all required fields",
      });
    }

    // Check if username, email, or mobile already exists
    const [existing] = await conn.execute(
      "SELECT * FROM PROFILE WHERE USERNAME = ? OR EMAIL = ? OR MOB = ?",
      [username, email, mob]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        status: "user_exists",
        message: "User with same username, email, or mobile already exists",
      });
    }

    // Set joining date
    const joiningDate = new Date();

    // Insert user record into MySQL
    await conn.execute(
      "INSERT INTO PROFILE (NAME, USERNAME, COUNTRY, AGE, EMAIL, MOB, JOININGDATE) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, username, country || null, age || null, email, mob, joiningDate]
    );

    // Check if an active session already exists
    const existingSession = await Session.findOne({ username });
    if (existingSession) {
      return res.status(400).json({
        status: "already_logged_in",
        message: "User already has an active session",
      });
    }

    // Generate and save session
    const sessionId = uuidv4();
    req.session.username = username;
    req.session.sessionId = sessionId;

    await Session.create({
      username,
      sessionId,
      createdAt: new Date(),
    });

    // Respond with success
    return res.status(201).json({
      status: "signup_success",
      message: "User registered and session created successfully",
      data: {
        username,
        sessionId,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      status: "server_error",
      message: "Internal server error during signup",
    });
  }
});

export default router;

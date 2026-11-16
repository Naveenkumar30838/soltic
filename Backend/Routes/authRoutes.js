import express from "express";
import { conn } from "../config/db.js";

const router = express.Router();

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({ status: "missing_email", message: "Email is required" });
    }
    if (!password) {
      return res.json({ status: "missing_password", message: "Password is required" });
    }

    const [rows] = await conn.execute(
      "SELECT * FROM PROFILE WHERE EMAIL = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.json({
        status: "user_not_found",
        message: "No user found with this email. Please Sign Up",
      });
    }

    const user = rows[0];
    const dbPassword = user.PASSWORD ?? user.password;
    const dbUsername = user.USERNAME ?? user.username;

    if (password !== dbPassword) {
      return res.json({
        status: "invalid_credentials",
        message: "Invalid email or password",
      });
    }

    if (!dbUsername) {
      console.error("USERNAME column missing on user row:", user);
      return res.status(500).json({
        status: "server_error",
        message: "User profile is missing a username field",
      });
    }

    // Attach username directly and save once
    req.session.username = dbUsername;

    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("MongoDB Session save error:", saveErr);
        return res.json({
          status: "server_error",
          message: "Internal server error during session creation",
        });
      }

      return res.json({
        status: "login_success",
        message: "Logged in successfully",
        data: {
          sessionId: req.sessionID,
          username: dbUsername,
        },
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.json({
      status: "server_error",
      message: "Internal server error during login",
    });
  }
});

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
  if (!req.session || !req.session.username) {
    return res.json({
      status: "no_active_session",
      message: "No active session found to logout",
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.json({
        status: "server_error",
        message: "Internal server error during logout",
      });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({
      status: "logout_success",
      message: "User logged out successfully",
    });
  });
});

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { name, username, country, age, email, mob, password, profession, bio } = req.body;

    if (!name || !username || !email || !mob || !password) {
      return res.json({
        status: "missing_fields",
        message: "Please provide all required fields",
      });
    }

    const [existing] = await conn.execute(
      "SELECT * FROM PROFILE WHERE USERNAME = ? OR EMAIL = ? OR MOB = ?",
      [username, email, mob]
    );

    if (existing.length > 0) {
      return res.json({
        status: "user_exists",
        message: "User with same username, email, or mobile already exists",
      });
    }

    const joiningDate = new Date();

    await conn.execute(
      `INSERT INTO PROFILE 
      (NAME, USERNAME, COUNTRY, AGE, EMAIL, MOB, JOININGDATE, PASSWORD, PROFESSION, BIO) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        username,
        country || null,
        age || null,
        email,
        mob,
        joiningDate,
        password,
        profession || null,
        bio || null,
      ]
    );

    req.session.username = username;

    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("Session Save Error in req.session:", saveErr);
        return res.json({ status: "server_error", message: saveErr.message });
      }

      return res.json({
        status: "signup_success",
        message: "User registered and session created successfully",
        data: {
          username,
          sessionId: req.sessionID,
        },
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      status: "server_error",
      message: "Internal server error during signup",
    });
  }
});

// AUTH CHECK ROUTE
router.get("/auth", (req, res) => {
  const username = req.session?.username;

  if (!username) {
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    username,
  });
});

export default router;
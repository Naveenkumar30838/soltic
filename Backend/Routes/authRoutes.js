import express from "express";
import { v4 as uuidv4 } from "uuid";
import { conn } from "../config/db.js";
import Session from "../Model/session.js";
import { mongo } from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

const router = express.Router();

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email) {
      return res.json({
        status: "missing_email",
        message: "Email is required",
      });
    }
    // ADD THIS: Check if password is provided
    if (!password) {
      return res.json({
        status: "missing_password",
        message: "Password is required",
      });
    }

    const [rows] = await conn.execute(
      "SELECT * FROM PROFILE WHERE EMAIL = ?",
      [email]
    );
    
    if (rows.length === 0) {
      return res.json({
        status: "user_not_found",
        message: "No user found with this email.Please Sign Up",
      });
    }

    const user = rows[0];

    // ADD THIS: Validate password
    // If you're storing hashed passwords (which you should be):
    // const bcrypt = require('bcrypt');
    // const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    
    // //  text :
    const isPasswordValid = password === user.PASSWORD;
    
    if (!isPasswordValid) {
      return res.json({
        status: "invalid_credentials",
        message: "Invalid email or password",
      });
    }
    const existingSession = await Session.findOne({ username: user.USERNAME });

    if (existingSession) {
      return res.json({
        status: "already_logged_in",
        message: "User already logged in from another session",
      });
    }

    const sessionId = uuidv4();
    req.session.username = user.USERNAME;
    req.session.sessionId = sessionId;
    await req.session.save();

    await Session.create({
      sessionId,
      username: user.USERNAME,
      createdAt: new Date(),
    });


    return res.json({
      status: "login_success",
      message: "User logged in successfully",
      data: {
        username: user.USERNAME,
        sessionId,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.json({
      status: "server_error",
      message: "Internal server error during login",
    });
  }
});

  //  LOGOUT ROUTE
  
router.post("/logout", async (req, res) => {
  try {
    const { username , sessionId } = req.session;
    if (!sessionId || !username ) {
      return res.json({
        status: "no_active_session",
        message: "No active session found to logout",
      });
    }
  //   // Remove from MongoDB
    await Session.deleteOne({ sessionId, username });
    // Destroy express-session
    req.session.destroy(() => {
      return res.json({
        status: "logout_success",
        message: "User logged out successfully",
      });
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.json({
      status: "server_error",
      message: "Internal server error during logout",
    });
  }
});
// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { name, username, country, age, email, mob, password,profession , bio   } = req.body;

    // Validate required fields
    if (!name || !username || !email || !mob || !password) {
      return res.json({
        status: "missing_fields",
        message: "Please provide all required fields",
      });
    }

    // Check for existing user/email/mobile
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

    // Insert user with password
    await conn.execute(
      `INSERT INTO PROFILE 
      (NAME, USERNAME, COUNTRY, AGE, EMAIL, MOB, JOININGDATE, PASSWORD, PROFESSION, BIO) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ name, username, country || null, age || null, email, mob, joiningDate, password, profession || null,    bio || null      ]
    );

    // Check if session exists
    const existingSession = await Session.findOne({ username });
    if (existingSession) {
      return res.json({
        status: "already_logged_in",
        message: "User already has an active session",
      });
    }

    // Create new session
    const sessionId = uuidv4();
    req.session.username = username;
    req.session.sessionId = sessionId;
    await req.session.save();

    await Session.create({
      username,
      sessionId,
      createdAt: new Date(),
    });

    return res.json({
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


// Route to check whether current requesting session is authenticated or not 
router.get("/auth" , async (req , res)=>{
  const {sessionId , username} = req.session;
  if (!sessionId || !username){
    return res.json({ authenticated: false });
  }

  const existingSession = await Session.findOne({sessionId, username});
  if(existingSession){
    return res.json({
      authenticated:true, 
      username:req.session.username
    })
  }
  return res.json({
    authenticated:false
  })

  // No need to check mysql as if profile doesn't exist and there is ongoing session (this can't happen ) ... the delete route on profile will automatically drop the ongoing session in mongodb (and profile in mysql) once the user sends a delete request 
});


export default router;

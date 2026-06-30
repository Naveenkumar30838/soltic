import express from "express";
import { v4 as uuidv4 } from "uuid";
import { conn } from "../config/db.js";
import Session from "../Model/session.js";
import { mongo } from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

const router = express.Router();


// Bugs : Unable to handle when there is session in db, but no session in browser (logged into one browser and trying to login from another )
// (no matter there is an existing session or not , after login will start a new session always )

// LOGIN ROUTE
// router.post("/login", async (req, res) => {
//   console.log("Login Requested")
//   try {
//     const { email, password } = req.body;
    
//     if (!email) {
//       return res.json({
//         status: "missing_email",
//         message: "Email is required",
//       });
//     }
//     // ADD THIS: Check if password is provided
//     if (!password) {
//       return res.json({
//         status: "missing_password",
//         message: "Password is required",
//       });
//     }

//     const [rows] = await conn.execute(
//       "SELECT * FROM PROFILE WHERE EMAIL = ?",
//       [email]
//     );
    
//     if (rows.length === 0) {
//       return res.json({
//         status: "user_not_found",
//         message: "No user found with this email.Please Sign Up",
//       });
//     }

//     const user = rows[0];

//     // ADD THIS: Validate password
//     // If you're storing hashed passwords (which you should be):
//     // const bcrypt = require('bcrypt');
//     // const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    
//     // //  text :
//     const isPasswordValid = password === user.PASSWORD;
    
//     if (!isPasswordValid) {
//       return res.json({
//         status: "invalid_credentials",
//         message: "Invalid email or password",
//       });
//     }
//     const existingSession = await Session.findOne({ username: user.USERNAME });
//     // Need to solve the issue when the session is saved in mongodb but it doesn't exists in frontend cookies

//     if (existingSession) {
//        const {sessionId:sessionIdCook , username:usernameCook} = req.session;
//         if (!sessionIdCook || !usernameCook){
//           console.log("Stage : There is existing session in Mongodb, but no existing session in Frontend So removing it from Mongo and redirecting to login ")
//           await Session.deleteOne({ username:user.USERNAME});

//           const existingSession = await Session.findOne({ username: user.USERNAME });
//           console.log("Existing Session Response Now is : " , existingSession);
//           console.log("Redirecting to Login");
//           res.redirect(req.originalUrl);
//           return;
//         }


//       console.log(`Existing Session Response in Login Route with username ${user.USERNAME} : ` ,existingSession);
//       console.log("For the Existing Session req.session is : " , req.session);
//       return res.json({
//         status: "already_logged_in",
//         message: "User already logged in from another session",
//         data: {
//         username: user.USERNAME,
//        },
//       });
//     }

//     const sessionId = uuidv4();
//     req.session.username = user.USERNAME;
//     req.session.sessionId = sessionId;
//     req.session.save((err) => {
//       if (err) {
//         console.error(" Session Save Error in req.session: ", err);  // Check what error comes here
//         return res.json({ status: "server_error", message: err.message });
//       }

//       console.log("Returing Login_Success in Last");
//       return res.json({
//         status: "login_success",
//         message: "User logged in successfully",
//         data: {
//           username: user.USERNAME,
//           sessionId,
//         },
//       });

//     });

//     // await Session.create({
//     //   sessionId,
//     //   username: user.USERNAME,
//     //   createdAt: new Date(),
//     // });

//     // console.log("Returing Login_Success in Last");
//     // return res.json({
//     //   status: "login_success",
//     //   message: "User logged in successfully",
//     //   data: {
//     //     username: user.USERNAME,
//     //     sessionId,
//     //   },
//     // });

//   } catch (err) {
//     console.error("Login error:", err);
//     return res.json({
//       status: "server_error",
//       message: "Internal server error during login",
//     });
//   }
// });
router.post("/login", async (req, res) => {
  console.log("Login Requested");

  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.json({
        status: "missing_email",
        message: "Email is required",
      });
    }

    if (!password) {
      return res.json({
        status: "missing_password",
        message: "Pass is required",
      });
    }

    // 2️⃣ Find user
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

    // 3️⃣ Validate password
    const isPasswordValid = password === user.PASSWORD;

    if (!isPasswordValid) {
      return res.json({
        status: "invalid_credentials",
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Let connect-mongo handle the session automatically
    // Replaced the manual Mongoose queries to prevent database duplication.
    req.session.regenerate((err) => {
      console.log("Regerating Session in Login Route");
      if (err) {
        return res.json({
          status: "Error in Login ",
          message: "Error in Session Regeneration : " + err.message,
        });
      }

      // Saving username directly inside express-session. 
      // connect-mongo automatically saves this and maps it to req.sessionID in the DB.
      req.session.username = user.USERNAME;

      // Force a manual save to guarantee MongoDB finishes writing before replying
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("MongoDB Session save error:", saveErr);
          return res.json({
            status: "server_error",
            message: "Internal server error during session creation",
          });
        }

        // Return your EXACT standard success response format
        return res.json({
          status: "login_success",
          message: "Logged in successfully",
          data: {
            sessionId: req.sessionID, // This matches the _id of the connect-mongo document
            username: user.USERNAME
          }
        });
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
//    LOGOUT ROUTE
  
router.post("/logout", async (req, res) => {
  try {
    // 1️⃣ Check if an active session actually exists
    // We only need to check if the username is attached to the session
    if (!req.session || !req.session.username) {
      return res.json({
        status: "no_active_session",
        message: "No active session found to logout",
      });
    }

    // 2️⃣ Let express-session and connect-mongo handle the deletion
    // This automatically deletes the document from your MongoDB database
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.json({
          status: "server_error",
          message: "Internal server error during logout",
        });
      }

      // 3️⃣ Clear the cookie from the user's browser
      // NOTE: "connect.sid" is the default cookie name for express-session. 
      // If you changed the 'name' property in your session config, use that name here instead.
      res.clearCookie("connect.sid");

      // 4️⃣ Return your exact standard success response
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

  
    // Create new session
    req.session.regenerate((err) => {
      if (err) {
        console.error(" Session Save Error in req.session: ", err);  // Check what error comes here
        return res.json({ status: "server_error", message: err.message });
      }

      req.session.username = username;

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error(" Session Save Error in req.session: ", saveErr);  // Check what error comes here
          return res.json({ status: "server_error", message: saveErr.message });
        }

        return res.json({
          status: "signup_success",
          message: "User registered and sessi on created successfully",
          data: {
            username,
            sessionId: req.sessionID,
          },
        });
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

// Route to check whether current requesting session is authenticated or not 
// Route to check whether current requesting session is authenticated or not 
router.get("/auth" , async (req , res)=>{
  // console.log("Auth Check Requested ");
  
  // We only pull username because connect-mongo handles the session ID mapping automatically
  const { username } = req.session || {}; 
  
  // console.log("Request.session is : " , req.session);
  
  if (!username){
    console.log("Returning False From Here 1 where req.session is : ");
    console.log(req.session);

    return res.json({ authenticated: false });
  }

  // NOTE: The manual Session.findOne() database check was completely removed here.
  // Why? Because if code execution reaches this line, connect-mongo has ALREADY 
  // queried MongoDB, found a valid unexpired session, and attached the username.
  // Doing a second findOne() is a redundant database hit that slows down your app!
  
  // If we have the username, they are guaranteed to be authenticated by MongoDB.
  return res.json({
    authenticated: true, 
    username: username
  });

  // No need to check mysql as if profile doesn't exist and there is ongoing session (this can't happen ) ... the delete route on profile will automatically drop the ongoing session in mongodb (and profile in mysql) once the user sends a delete request 
});

export default router;

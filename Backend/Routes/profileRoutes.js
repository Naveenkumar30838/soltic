import express from "express";
import { conn } from "../config/db.js";
import Session from '../Model/session.js';
import Chats from "../Model/chatModel.js";
import requireAuth  from "../Middleware/requireAuth.js";
const router = express.Router();

router.get("/profile/:username",requireAuth ,  async (req, res) => {
  try {
    const username = req.params.username;
    const [result] = await conn.execute(
      `SELECT 
          NAME, USERNAME, COUNTRY, AGE, EMAIL, MOB,
          PROFESSION, BIO
       FROM PROFILE 
       WHERE USERNAME = ?`,
      [username]
    );

    if (!result.length) {
      return res.json({ status: "not_found" });
    }

    res.json({ status: "success", data: result[0] });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ status: "error" });
  }
});

router.delete("/profile/:username", async (req, res) => {
  const username = req.params.username;

  try {
    if (!username) {
      return res.json({ status: "missing_username" });
    }

    //  DELETE Trips (MySQL)
    await conn.execute("DELETE FROM TRIPS WHERE USERNAME = ?", [username]);

    //  DELETE Chats (MongoDB)
    await Chats.deleteMany({ username });

    //  DELETE User Profile (MySQL)
    const [profileDelete] = await conn.execute(
      "DELETE FROM PROFILE WHERE USERNAME = ?",
      [username]
    );

    if (profileDelete.affectedRows === 0) {
      return res.json({ status: "not_found" });
    }

    //  DELETE ALL MONGO SESSIONS RELATED TO THE USER

    const sessionDelete = await Session.deleteMany({
      "username": username
    });

    
    // Destroy current Express session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
      });
    }

    return res.json({
      status: "success",
      message: "User, trips, chats, and all sessions deleted successfully"
    });

  } catch (err) {
    console.error("Error deleting profile:", err);
    return res.status(500).json({ status: "error" });
  }
});

router.get("/profile/:username/trips", async (req, res) => {
  try {
    const username = req.params.username;

    const [trips] = await conn.execute(
      "SELECT * FROM TRIPS WHERE USERNAME = ?",
      [username]
    );

    const today = new Date();

    const upcoming = trips.filter(t => new Date(t.STARTDATE) > today);
    const past = trips.filter(t => new Date(t.ENDDATE) < today);

    res.json({
      status: "success",
      upcoming,
      past
    });

  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});



export default router;

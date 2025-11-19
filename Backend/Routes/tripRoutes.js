import express from "express";
import { conn } from "../config/db.js";
import requireAuth  from "../Middleware/requireAuth.js";
const router = express.Router();

router.post("/trips", requireAuth, async (req, res) => {
  try {
    const username = req.session.username;

    if (!username) {
      return res.json({ status: "not_logged_in" });
    }

    const {
      startdate,
      startloc,
      enddate,
      endloc,
      roomscount,
      cost,
      travellerscount
    } = req.body;

    const ID = `trip_${Date.now()}`;

    await conn.execute(
      `INSERT INTO TRIPS 
        (ID, USERNAME, STARTDATE, STARTLOC, ENDDATE, ENDLOC, ROOMSCOUNT, COST, TRAVELLERSCOUNT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID,
        username,
        startdate,
        startloc,
        enddate,
        endloc,
        roomscount,
        cost,
        travellerscount
      ]
    );

    res.json({
      status: "success",
      message: "Trip added",
      username
    });

  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "Database insert failed" });
  }
});

export default router;
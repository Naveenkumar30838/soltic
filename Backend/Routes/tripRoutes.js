import express from "express";
import { conn } from "../config/db.js";
import requireAuth  from "../Middleware/requireAuth.js";
const router = express.Router();

router.post("/trips", requireAuth, async (req, res) => {
  console.log("Request Received on the /trips route with the data")
  console.log(req.body);
  // Adds a new Trip in the Trips database 
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

router.delete("/trips/:id", requireAuth, async (req, res) => {
  try {
    const username = req.session.username;
    const tripId = req.params.id;

    if (!username) {
      return res.json({ status: "not_logged_in" });
    }

    // Delete only if the trip belongs to the logged-in user
    const [result] = await conn.execute(
      "DELETE FROM TRIPS WHERE ID = ? AND USERNAME = ?",
      [tripId, username]
    );

    if (result.affectedRows === 0) {
      return res.json({
        status: "error",
        message: "Trip not found or not authorized to delete",
      });
    }

    res.json({
      status: "success",
      message: "Trip deleted successfully",
      deletedId: tripId,
    });

  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "Database delete failed",
    });
  }
});
router.get('/trip/:id',requireAuth,async (req , res)=>{
  try {
    const id = req.params.id;
    const [result] = await conn.execute('SELECT * FROM TRIPS WHERE ID = ? ' , [id]);
    res.json({
      status:"success",
      message:"Trip Details Fetched Successfully",
      tripDetails:result[0]
    })

  } catch (err) {
    console.log("Error in Fetching Trip Details Inside trip/id")
    res.json({
      status:"failed",
      message:"Error in Fetching Trip Details",
      tripDetails:"Error"
    })
  }
})

router.get('/trip/:id/generate-plan',requireAuth,async (req , res)=>{
  try {
    const id = req.params.id;
    const [result] = await conn.execute('SELECT * FROM TRIPS WHERE ID = ? ' , [id]);
    res.json({
      status:"success",
      message:"Trip Details Fetched Successfully",
      tripDetails:result[0]
    })

  } catch (err) {
    console.log("Error in Fetching Trip Details Inside trip/id")
    res.json({
      status:"failed",
      message:"Error in Fetching Trip Details",
      tripDetails:"Error"
    })
  }
})

export default router;
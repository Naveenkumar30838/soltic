import express from "express";
import { conn } from "../config/db.js";
import requireAuth  from "../Middleware/requireAuth.js";
import { getPlan } from "../planner.js";
import TripPlan from "../Model/tripPlan.js";
const router = express.Router();

router.post("/trips", requireAuth, async (req, res) => {
 
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
router.get('/trip/:id', requireAuth, async (req, res) => {
  try {

    const id = req.params.id;

    const [result] = await conn.execute(
      'SELECT * FROM TRIPS WHERE ID = ?',
      [id]
    );

    if (result.length === 0) {
      return res.json({
        status: "failed",
        message: "Trip not found"
      });
    }

    const tripDetails = result[0];

    // CHECK IF PLAN EXISTS

    let existingPlan = await TripPlan.findOne({
      tripId: id
    });
console.log("Existing Plan:", existingPlan);
if (existingPlan) {
  return res.json({
    status: "success",
    message: "Trip Details Fetched Successfully",
    tripDetails,
    plan: existingPlan.roadmap
  });
}
    // GENERATE IF MISSING

    if (!existingPlan) {

      console.log("No plan found. Generating...");

      let generatedRoadmap = await getPlan(
  `Generate a travel roadmap for this trip:

  ${JSON.stringify(tripDetails, null, 2)}
  `
);

generatedRoadmap = JSON.parse(generatedRoadmap);

generatedRoadmap = generatedRoadmap.map((step, index) => ({
  stepId: `step_${index + 1}`,
  ...step
}));

existingPlan = await TripPlan.create({
  tripId: id,
  username: tripDetails.USERNAME,
  roadmap: generatedRoadmap
});
    }

    // RETURN RESPONSE

    return res.json({
      status: "success",
      message: "Trip Details Fetched Successfully",
      tripDetails,
      plan: existingPlan.roadmap
    });

  } catch (err) {

    console.log(
      "Error in Fetching Trip Details Inside trip/id",
      err
    );

    return res.json({
      status: "failed",
      message: "Error in Fetching Trip Details",
      tripDetails: "Error"
    });
  }
});
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

router.put("/trip/:id/edit-plan", requireAuth, async (req, res) => {
  try {

    const tripId = req.params.id;
    const { editPrompt } = req.body;

    if (!editPrompt) {
      return res.json({
        status: "failed",
        message: "Edit prompt is required"
      });
    }

    // Fetch trip details
    const [tripRows] = await conn.execute(
      "SELECT * FROM TRIPS WHERE ID = ?",
      [tripId]
    );

    if (tripRows.length === 0) {
      return res.json({
        status: "failed",
        message: "Trip not found"
      });
    }

    const tripDetails = tripRows[0];

    // Fetch existing plan
    const existingPlan = await TripPlan.findOne({
      tripId
    });

    if (!existingPlan) {
      return res.json({
        status: "failed",
        message: "Plan not found"
      });
    }

    // Ask Gemini to update roadmap
    let updatedRoadmap = await getPlan(`
Trip Details:
${JSON.stringify(tripDetails, null, 2)}

Current Plan:
${JSON.stringify(existingPlan.roadmap, null, 2)}

User Requested Changes:
${editPrompt}

Update the roadmap according to the user's changes.

Preserve existing structure whenever possible.

Return ONLY valid JSON array.
`);

    // Clean Gemini response
    updatedRoadmap = updatedRoadmap
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    updatedRoadmap = JSON.parse(updatedRoadmap);

    // Generate step ids
    updatedRoadmap = updatedRoadmap.map((step, index) => ({
      stepId: `step_${index + 1}`,
      ...step
    }));

    // Update MongoDB document
    existingPlan.roadmap = updatedRoadmap;
    existingPlan.version += 1;
    existingPlan.lastEditPrompt = editPrompt;

    await existingPlan.save();

    return res.json({
      status: "success",
      message: "Plan updated successfully",
      plan: existingPlan.roadmap
    });

  } catch (err) {

    console.log("Error editing plan:", err);

    return res.json({
      status: "failed",
      message: "Error updating plan"
    });

  }
});
export default router;
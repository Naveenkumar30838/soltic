// Checks whether the incoming request is authentic or not 
import Session from "../Model/session.js";  // MongoDB session model

export default async function requireAuth(req, res, next) {
  try {
    const sessionId = req.session?.sessionId;
    const username = req.session?.username;
    // Step 1 — check if session exists in the request
    if (!sessionId || !username) {
      console.log("Middlewre response");
      return res.json({
        status: "not_logged_in",
        message: "You must be logged in to access this resource",
      });
    }
    // Step 2 — verify session with MongoDB 
    const existingSession = await Session.findOne({ sessionId, username });

    if (!existingSession) {
      return res.json({
        status: "not_logged_in",
        message: "Session is invalid or expired",
      });
    }
    // Step 3 — authenticated → allow request
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.json({
      status: "server_error",
      message: "Error while checking session",
    });
  }
}

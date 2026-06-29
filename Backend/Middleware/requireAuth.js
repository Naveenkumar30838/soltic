// Checks whether the incoming request is authentic or not 
// import Session from "../Model/session.js";  // You can safely delete this import now!

export default async function requireAuth(req, res, next) {
  try {
    // We only check username; connect-mongo handles the session ID behind the scenes
    const username = req.session?.username;
    
    // Step 1 — check if session exists in the request
    if (!username) {
      console.log("Middlewre response Here");
      return res.json({
        status: "not_logged_in",
        message: "You must be logged in to access this resource",
      });
    }
    
    // Step 2 — verify session with MongoDB 
    // (INTENTIONALLY REMOVED: connect-mongo automatically verifies the session 
    // against MongoDB before this middleware even runs. If the session was 
    // invalid or expired in MongoDB, 'username' would be undefined in Step 1).

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
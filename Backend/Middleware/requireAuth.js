// Checks whether the incoming request is authentic or not 

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
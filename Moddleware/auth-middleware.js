const jwt = require('jsonwebtoken');
const User = require('../moddel/user-model'); // Ensure the path is correct

// const authMiddleware = async (req, res, next) => {
//     try {
//         // Extract token from cookies or Authorization header
//         const token = req.cookies?.accessToken || req.header('Authorization')?.replace(/^Bearer\s+/i, "").trim();

//         if (!token) {
//             return res.status(401).json({ message: 'Access denied. No token provided.' });
//         }
         
//         // Verify the token
//         const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY); 

//         // Ensure the token contains the required data (email or user ID)
//         if (!isVerified.email && !isVerified.id) {
//             return res.status(401).json({ message: 'Invalid token. No user data found.' });
//         }

//         // Find the user in the database
//         const userData = await User.findOne({ email: isVerified.email }).select('-password');

//         if (!userData) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Attach user data and token to the request object
//         req.user = userData;
//         req.token = token;
//         req.userID = userData._id;

//         // Proceed to the next middleware or route handler
//         next();
//     } catch (error) { 
//         console.error('Error in authMiddleware:', error.message);
//         return res.status(401).json({
//             message: 'Invalid or expired token.',
//             error: true,
//             success: false,
//         });
//     }
// };



const authMiddleware = async (req, res, next) => {
  try {
    // ✅ ONLY Authorization header (frontend-safe)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token payload",
      });
    }

    // ✅ FIND USER BY ID (BEST PRACTICE)
   const user = await User.findById(userId).select("-password");


    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // ✅ ATTACH TO REQUEST
    req.user = user;
    req.userID = user._id;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      error: true,
      message: "Invalid or expired token",
    });
  }
};




module.exports = authMiddleware;
